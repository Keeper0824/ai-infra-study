$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms.DataVisualization
Add-Type -AssemblyName System.Drawing
$rows = Import-Csv -LiteralPath (Join-Path $PSScriptRoot 'q-projection.csv')
$chart = New-Object System.Windows.Forms.DataVisualization.Charting.Chart
$chart.Width = 1600
$chart.Height = 820
$chart.BackColor = [System.Drawing.Color]::White
$chart.AntiAliasing = 'All'
$font = New-Object System.Drawing.Font('Microsoft YaHei', 11)
$title = $chart.Titles.Add('Q projection: arithmetic intensity and resource time (d = 4096)')
$title.Font = New-Object System.Drawing.Font('Microsoft YaHei', 18)
foreach ($name in @('Intensity', 'Time')) {
    $area = $chart.ChartAreas.Add($name)
    $area.AxisX.Minimum = 1
    $area.AxisX.Maximum = 256
    $area.AxisX.Interval = 50
    $area.AxisX.Title = 'Input rows M'
    $area.AxisX.LabelStyle.Font = $font
    $area.AxisY.LabelStyle.Font = $font
    $area.AxisX.TitleFont = $font
    $area.AxisY.TitleFont = $font
    $area.AxisY.Minimum = 0
    $area.AxisX.MajorGrid.LineColor = [System.Drawing.Color]::Gainsboro
    $area.AxisY.MajorGrid.LineColor = [System.Drawing.Color]::Gainsboro
}
$chart.ChartAreas['Intensity'].Position = New-Object System.Windows.Forms.DataVisualization.Charting.ElementPosition(2, 12, 47, 70)
$chart.ChartAreas['Time'].Position = New-Object System.Windows.Forms.DataVisualization.Charting.ElementPosition(51, 12, 47, 70)
$chart.ChartAreas['Intensity'].AxisY.Title = 'FLOPs / byte'
$chart.ChartAreas['Intensity'].AxisY.Maximum = 360
$chart.ChartAreas['Time'].AxisY.Title = 'Service time (microseconds)'
$chart.ChartAreas['Time'].AxisY.Maximum = 60
$legend = $chart.Legends.Add('Legend')
$legend.Docking = 'Bottom'
$legend.Font = $font
function Add-Line($name, $area, $field, $color, $dash = 'Solid', $constant = -1) {
    $s = $chart.Series.Add($name)
    $s.ChartArea = $area
    $s.ChartType = 'Line'
    $s.BorderWidth = 3
    $s.Color = [System.Drawing.ColorTranslator]::FromHtml($color)
    $s.BorderDashStyle = $dash
    foreach ($r in $rows) {
        $value = if ($constant -ge 0) { $constant } else { [double]$r.$field }
        [void]$s.Points.AddXY([int]$r.M, $value)
    }
}
Add-Line 'I(M)' 'Intensity' 'intensity' '#2563eb'
Add-Line 'P/R: baseline, M*=178.1' 'Intensity' '' '#d97706' 'Dash' (165.2e12/1.008e12)
Add-Line '2P/R: M*=390.2 (outside range)' 'Intensity' '' '#dc2626' 'Dash' (2*165.2e12/1.008e12)
Add-Line 'P/2R: M*=85.4' 'Intensity' '' '#059669' 'Dash' (165.2e12/(2*1.008e12))
Add-Line 'Compute' 'Time' 'compute_us' '#2563eb'
Add-Line 'Memory' 'Time' 'memory_us' '#d97706'
Add-Line 'Compute, 2x throughput' 'Time' 'compute_2x_us' '#dc2626' 'Dash'
Add-Line 'Memory, 2x bandwidth' 'Time' 'memory_2x_us' '#059669' 'Dash'
$chart.SaveImage((Join-Path $PSScriptRoot 'q-projection.png'), 'Png')
$chart.Dispose()
Write-Output 'Saved q-projection.png'
