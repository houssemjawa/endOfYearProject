/**
 * Created by mac on 12/04/17.
 */
google.load("visualization", "1", {packages:["geochart"]});
google.setOnLoadCallback(drawRegionsMap);
colors: ['#b2cedc', '#7b7b7b']
// ****************** \\
function drawRegionsMap() {
    var data = google.visualization.arrayToDataTable([
        ['State Name', 'State Code'],
        ['Tunis', 'Tunis'],
        ['Ariana', 'Ariana'],
        ['Ben Arous', 'Ben Arous'],
        ['Manouba', 'Manouba'],
        ['Nabeul', 'Nabeul'],
        ['Zaghouan', 'Zaghouan'],
        ['Bizerte', 'Bizerte'],
        ['Béja', 'Béja'],
        ['Jendouba', 'Jendouba'],

        ['Kef', 'Kef'],
        ['Siliana', 'Siliana'],
        ['Sousse', 'Sousse'],
        ['Monastir', 'Monastir'],
        ['Mahdia', 'Mahdia'],
        ['Sfax', 'Sfax'],
        ['Kairouan', 'Kairouan'],
        ['Kasserine', 'Kasserine'],
        ['Sidi Bouzid', 'Sidi Bouzid'],
        ['Gabès', 'Gabès'],
        ['Mednine', 'Mednine'],
        ['Tataouine', 'Tataouine'],
        ['Gafsa', 'Gafsa'],
        ['Tozeur', 'Tozeur'],
        ['Kebili', 'Kebili'],

    ]);

    var options = {
        region: 'TN',
        resolution: 'provinces',
        keepAspectRatio: true,
        enableRegionInteractivity: true,
        //tooltip: { trigger: ['hover'] }
        title:"Color testing",
        width:1000, height:1000,
        hAxis: {title: "Year"},
        colors: ['#b2cedc', '#7b7b7b'] ,
        min: '0',
        legend: 'none'
    };

    var chart = new google.visualization.GeoChart(document.getElementById('geochart-states'));

    chart.draw(data, options);

    // ******************* \\
    google.load('visualization', '1', {'packages': ['geochart']});
    var visualization = new google.visualization.GeoChart(container);


    // ******************* \\
    google.visualization.events.addListener(chart, 'select', selectHandler);

    function selectHandler() {
        $(this).css('backgroundColor: blue');
    }
};




// ******************* \\

$( "path" ).on('click', function( event ) {
 alert( event.currentTarget === this ); // true
 $(this).css('background-color: red');
 });