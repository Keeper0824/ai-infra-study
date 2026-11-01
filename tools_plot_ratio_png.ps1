Add-Type -AssemblyName System.Windows.Forms.DataVisualization
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$csvPath = Join-Path $root '创业板指中证红利比值_沪深300指数_近10年.csv'
$pngPath = Join-Path $root '创业板指中证红利比值_沪深300指数_近10年.png'
$rows = Import-Csv -LiteralPath $csvPath

$chart = New-Object System.Windows.Forms.DataVisualization.Charting.Chart
$chart.Width = 1400
$chart.Height = 760
$chart.BackColor = [System.Drawing.Color]::White
$chart.AntiAliasing = 'All'
$chart.TextAntiAliasingQuality = 'High'

$area = New-Object System.Windows.Forms.DataVisualization.Charting.ChartArea 'Main'
$area.Position = New-Object System.Windows.Forms.DataVisualization.Charting.ElementPosition(7, 12, 89, 75)
$area.AxisX.Title = '日期'
$area.AxisX.LabelStyle.Format = 'yyyy-MM'
$area.AxisX.IntervalType = 'Years'
$area.AxisX.Interval = 1
$area.AxisX.MajorGrid.LineColor = [System.Drawing.Color]::FromArgb(232, 235, 239)
$area.AxisX.LabelStyle.Font = New-Object System.Drawing.Font('Microsoft YaHei', 9)
$area.AxisX.TitleFont = New-Object System.Drawing.Font('Microsoft YaHei', 10)
$area.AxisY.Title = '比值（收盘点位之比）'
$area.AxisY.LabelStyle.Format = '0.00'
$ratioValues = @($rows | ForEach-Object { [double]$_.'创业板指/中证红利' })
$ratioMin = ($ratioValues | Measure-Object -Minimum).Minimum
$ratioMax = ($ratioValues | Measure-Object -Maximum).Maximum
$ratioPadding = [Math]::Max(($ratioMax - $ratioMin) * 0.08, 0.01)
$area.AxisY.IsStartedFromZero = $false
$area.AxisY.Minimum = $ratioMin - $ratioPadding
$area.AxisY.Maximum = $ratioMax + $ratioPadding
$area.AxisY.MajorGrid.LineColor = [System.Drawing.Color]::FromArgb(225, 229, 234)
$area.AxisY.LabelStyle.Font = New-Object System.Drawing.Font('Microsoft YaHei', 9)
$area.AxisY.TitleFont = New-Object System.Drawing.Font('Microsoft YaHei', 10)
$hs300Values = @($rows | ForEach-Object { [double]$_.'沪深300收盘' })
$hs300Min = ($hs300Values | Measure-Object -Minimum).Minimum
$hs300Max = ($hs300Values | Measure-Object -Maximum).Maximum
$hs300Padding = [Math]::Max(($hs300Max - $hs300Min) * 0.08, 50)
$area.AxisY2.Enabled = 'True'
$area.AxisY2.Title = '沪深300收盘点位'
$area.AxisY2.LabelStyle.Format = '0'
$area.AxisY2.IsStartedFromZero = $false
$area.AxisY2.Minimum = $hs300Min - $hs300Padding
$area.AxisY2.Maximum = $hs300Max + $hs300Padding
$area.AxisY2.MajorGrid.Enabled = $false
$area.AxisY2.LabelStyle.ForeColor = [System.Drawing.Color]::FromArgb(29, 79, 145)
$area.AxisY2.TitleForeColor = [System.Drawing.Color]::FromArgb(29, 79, 145)
$area.AxisY2.LabelStyle.Font = New-Object System.Drawing.Font('Microsoft YaHei', 9)
$area.AxisY2.TitleFont = New-Object System.Drawing.Font('Microsoft YaHei', 10)
$chart.ChartAreas.Add($area)

$chinextSeries = New-Object System.Windows.Forms.DataVisualization.Charting.Series '创业板指 / 中证红利'
$chinextSeries.ChartType = 'Line'
$chinextSeries.XValueType = 'DateTime'
$chinextSeries.YValueType = 'Double'
$chinextSeries.Color = [System.Drawing.Color]::FromArgb(217, 72, 65)
$chinextSeries.BorderWidth = 3
$chart.Series.Add($chinextSeries)

$hs300Series = New-Object System.Windows.Forms.DataVisualization.Charting.Series '沪深300指数（右轴）'
$hs300Series.ChartType = 'Line'
$hs300Series.XValueType = 'DateTime'
$hs300Series.YValueType = 'Double'
$hs300Series.Color = [System.Drawing.Color]::FromArgb(37, 99, 166)
$hs300Series.BorderWidth = 3
$hs300Series.YAxisType = 'Secondary'
$chart.Series.Add($hs300Series)

foreach ($row in $rows) {
    $day = [DateTime]::ParseExact($row.'日期', 'yyyy-MM-dd', [System.Globalization.CultureInfo]::InvariantCulture)
    $chinextRatio = [double]::Parse($row.'创业板指/中证红利', [System.Globalization.CultureInfo]::InvariantCulture)
    $hs300Close = [double]::Parse($row.'沪深300收盘', [System.Globalization.CultureInfo]::InvariantCulture)
    [void]$chinextSeries.Points.AddXY($day, $chinextRatio)
    [void]$hs300Series.Points.AddXY($day, $hs300Close)
}

$title = New-Object System.Windows.Forms.DataVisualization.Charting.Title
$title.Text = '创业板指 / 中证红利比值与沪深300指数（近10年）'
$title.Font = New-Object System.Drawing.Font('Microsoft YaHei', 17, [System.Drawing.FontStyle]::Bold)
$title.Docking = 'Top'
$chart.Titles.Add($title)

$startRatio = [double]::Parse($rows[0].'创业板指/中证红利', [System.Globalization.CultureInfo]::InvariantCulture)
$strip = New-Object System.Windows.Forms.DataVisualization.Charting.StripLine
$strip.IntervalOffset = $startRatio
$strip.StripWidth = 0
$strip.BorderColor = [System.Drawing.Color]::FromArgb(130, 107, 114, 128)
$strip.BorderWidth = 1
$strip.BorderDashStyle = 'Dash'
$strip.Text = ('创业板起点 {0:N3}' -f $startRatio)
$strip.Font = New-Object System.Drawing.Font('Microsoft YaHei', 8)
$area.AxisY.StripLines.Add($strip)

$chinextLast = $chinextSeries.Points[$chinextSeries.Points.Count - 1]
$chinextLast.MarkerStyle = 'Circle'
$chinextLast.MarkerSize = 8
$chinextLast.MarkerColor = [System.Drawing.Color]::FromArgb(185, 28, 28)
$chinextLast.Label = ('创业板 {0:N3}' -f [double]$rows[-1].'创业板指/中证红利')
$chinextLast.LabelForeColor = [System.Drawing.Color]::FromArgb(127, 29, 29)
$chinextLast.Font = New-Object System.Drawing.Font('Microsoft YaHei', 8)

$hs300Last = $hs300Series.Points[$hs300Series.Points.Count - 1]
$hs300Last.MarkerStyle = 'Circle'
$hs300Last.MarkerSize = 8
$hs300Last.MarkerColor = [System.Drawing.Color]::FromArgb(29, 79, 145)
$hs300Last.Label = ('沪深300 {0:N2}' -f [double]$rows[-1].'沪深300收盘')
$hs300Last.LabelForeColor = [System.Drawing.Color]::FromArgb(29, 79, 145)
$hs300Last.Font = New-Object System.Drawing.Font('Microsoft YaHei', 8)

$legend = New-Object System.Windows.Forms.DataVisualization.Charting.Legend
$legend.Docking = 'Top'
$legend.Alignment = 'Far'
$legend.Font = New-Object System.Drawing.Font('Microsoft YaHei', 9)
$chart.Legends.Add($legend)

$chart.SaveImage($pngPath, [System.Windows.Forms.DataVisualization.Charting.ChartImageFormat]::Png)
$chart.Dispose()
Write-Output $pngPath
