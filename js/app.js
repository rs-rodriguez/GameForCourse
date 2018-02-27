
var imagenes = [
    'image/1.png', 'image/2.png', 'image/3.png', 'image/4.png'
];
var totalImagenes = imagenes.length;
var dimension = 7;
var points = [
    10, 50, 75, 100, 150, 200, 250,300,325,350,375,400,425,450
];
var matrizObj = [];
var puntos = 0,
movimientos = 0,
tiempoJuego = 120, // segundos
tiempoRestante,
tiempo,
indColor = 0,
indStatus = 0,
figValidas = 0;
var colores = ['white', 'yellow'];
var divMovimiento = null;
var divArrastre = null;

$(function(){

    var gameObj = function(i,f,obj,src){
        return {
            i: i,
            c: f,
            o: obj,
            objurl:src,
            combo: false 
        }
    };

    function actualizarTiempo() {
        $('#timer').html(formatedTime(tiempoRestante));
    }

    function actualizarMovimientos() {
        $('#movimientos-text').html(movimientos);
    }

    function actualizarPuntos() {
        $('#score-text').html(puntos);
    }

    function pad(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    function formatedTime(time) {
        var min = parseInt(time / 60),
                sec = time - (min * 60);
        console.log((min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2));
        return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2);
    }

    var startTime = function() {
        tiempoRestante = tiempoJuego;
        tiempo = setTimeout(counterTimer, 1000);
    }

    var counterTimer = function() {
        tiempoRestante -= 1;
        actualizarTiempo();
        if (tiempoRestante === 0) {
            return gameScore.finalizeTimer();
        }
        tiempo = setTimeout(counterTimer, 1000);
    }

    var gameScore = {
        init: function(){
            this.createTable();
            $(".btn-reinicio").click(this.btnStart);
            //this.mostrarImagenes();
        },
        btnStart: function(){
            $('.btn-reinicio').text('Reiniciar');
            if (indStatus === 0) {
                indStatus = 1;
                startTime();
                gameScore.activarMovimientos();
                seleccionaryEliminar();
            } else {
                gameScore.restart();
            }
        },
        restart: function(){
            var divTime = $('.time').css("display");
            figValidas = 0;
            puntos = 0;
            movimientos = 0;
            tiempoRestante = tiempoJuego;
            actualizarTiempo();
            actualizarMovimientos();
            actualizarPuntos();
            clearTimeout(tiempo);
            if (divTime ==='none'){
                $('.panel-tablero').slideToggle("slow", function () {
                    startTime();
                });
                $('.time').show();
                $('.finalizacion').hide();
                $('.panel-score').css({'width': '25%'});
                $('.panel-score').resize({
                    animate: true
                });
            }else{
                startTime();
            }        
        },
        randomImage: function(){
            var dynamicImage = Math.floor((Math.random()*totalImagenes));
            return imagenes[dynamicImage];
        },
        createTable: function(){
            for(var i=0; i < dimension; i++){
                matrizObj[i]=[];
                for(var f=0; f < dimension; f++){
                    matrizObj[i][f]= new gameObj(i,f,null,this.randomImage());
                    var columna = $('#img_'+i+'_'+f).html("<img src='"+matrizObj[i][f].objurl + "' alt='"+i+","+f+"'/>");
                    matrizObj[i][f].o = columna;
                }
            }
        },
        mostrarImagenes: function (){
            for (var i = 0; i < dimension; i++){
                  for (var f = 0; f < dimension; f++){    
                      if (matrizObj[i][f].o.css("opacity")===0)
                      matrizObj[i][f].o.css("opacity", 1);                    
                  }                    
            }         
        },
        activarMovimientos: function (){
            for (var f = 0; f < dimension; f++) {
                 for (var c = 0; c < dimension; c++) {
                     var celda = $('#img_' + f + '_' + c);
                      celda.draggable(
                            {
                                containment: '.panel-tablero',
                                cursor: 'move',
                                zIndex: 100,
                                opacity: 0.85,
                                snap: '.panel-tablero',
                                stack: '.panel-tablero',
                                revert: true,
                                start: handleDragStart,
                                stop: handleDragStop
                            });
                    celda.droppable(
                            {
                                drop: handleDropEvent
                            });
                 }
            }
        },
        finalizeTimer: function() {
            $('.panel-tablero').slideToggle("slow", function () {
                $('.time').hide();
                $('.finalizacion').show();
                $('.panel-score').css({'width': '100%'});
                $('.panel-score').resize({
                    animate: true
                });
            });
        }
    }
    
    function handleDragStop(event, ui) {

        console.log('DIV Final: "' + divArrastre);
        console.log("DIV Inicial: " + divMovimiento);

        var src = divMovimiento.split("_");

        var sf = src[1];
        var sc = src[2];

        var dst = divArrastre.split("_");

        var df = dst[1];
        var dc = dst[2];

        // verificando que el cambio de divs sea el de al lado.
        var ddx = Math.abs(parseInt(sf) - parseInt(df));
        var ddy = Math.abs(parseInt(sc) - parseInt(dc));

        if (ddx > 1 || ddy > 1)
        {
            console.log("Distancia invalida > 1");
            return;
        }

        if (sf !== df && sc !== dc) {
            console.log("Movimiento invalido...");
            return;
        }

        console.log("swap " + sf + "," + sc + " to " + df + "," + dc);

        var tmp = matrizObj[sf][sc].objurl;
        matrizObj[sf][sc].objurl = matrizObj[df][dc].objurl;
        matrizObj[sf][sc].o.html("<img src='" + matrizObj[sf][sc].objurl + "' alt='" + sf + "," + sc + "'/>");
        matrizObj[df][dc].objurl = tmp;
        matrizObj[df][dc].o.html("<img src='" + tmp + "' alt='" + df + "," + dc + "'/>");

        movimientos += 1;
        divMovimiento = null;
        divArrastre = null;
        actualizarMovimientos();
        // Reseteamos el contador de combos secuenciales
        figValidas = 0;
        seleccionaryEliminar();
    }

    function handleDragStart(event, ui) {
        divMovimiento = event.target.id;
        console.log("Div Inicio Start :" + divMovimiento);
    }

    function handleDropEvent(event, ui) {
        //var draggable = ui.draggable; // a donde llega el div a mover
        divArrastre = event.target.id;
        console.log('DIV Final Drop: "' + divArrastre + '"!');
        console.log("DIV Inicio Drop: " + divMovimiento);

    }

    function seleccionaryEliminar() {
        // Combo Horizontal        
        for (var f = 0; f < dimension; f++) {
            var prevCelda = null;
            var figLongitud = 0;
            var figInicio = null;
            var figFin = null;

            for (var c = 0; c < dimension; c++) {

                // Primer celda para el combo
                if (prevCelda === null)
                {
                    //console.log("FirstCell: " + r + "," + c);
                    prevCelda = matrizObj[f][c].objurl;
                    figInicio = c;
                    figLongitud = 1;
                    figFin = null;
                    continue;
                } else {
                    var curCelda = matrizObj[f][c].objurl;
                    if (!(prevCelda === curCelda)) {
                        if (figLongitud >= 3)
                        {
                            figValidas += 1;
                            figFin = c - 1;
                            console.log("Combo Horizontal de " + figInicio + " a " + figFin + "!");
                            for (var ci = figInicio; ci <= figFin; ci++)
                            {
                                matrizObj[f][ci].enCombo = true;
                                matrizObj[f][ci].objurl = null;
                            }
                            puntos += points[figLongitud];
                            puntos += points[figValidas];
                        }
                        prevCelda = matrizObj[f][c].objurl;
                        figInicio = c;
                        figFin = null;
                        figLongitud = 1;
                        continue;
                    } else {
                        figLongitud += 1;
                        if (c === (dimension - 1)) {
                            if (figLongitud >= 3)
                            {
                                figValidas += 1;
                                figFin = c;
                                console.log("Combo Horizontal de " + figInicio + " a " + figFin + "!");
                                for (var ci = figInicio; ci <= figFin; ci++)
                                {
                                    matrizObj[f][ci].enCombo = true;
                                    matrizObj[f][ci].objurl = null;
                                }
                                puntos += points[figLongitud];
                                puntos += points[figValidas];
                                prevCelda = null;
                                figInicio = null;
                                figFin = null;
                                figLongitud = 1;
                                continue;
                            }
                        } else {
                            prevCelda = matrizObj[f][c].objurl;
                            figFin = null;
                            continue;
                        }
                    }
                }
            }
        }

        // Combo Vertical
        for (var c = 0; c < dimension; c++)
        {
            var prevCelda = null;
            var figLongitud = 0;
            var figInicio = null;
            var figFin = null;

            for (var f = 0; f < dimension; f++)
            {
                if (matrizObj[f][c].enCombo)
                {
                    figInicio = null;
                    figFin = null;
                    prevCelda = null;
                    figLongitud = 1;
                    continue;
                }
                if (prevCelda === null)
                {
                    prevCelda = matrizObj[f][c].objurl;
                    figInicio = f;
                    figLongitud = 1;
                    figFin = null;
                    continue;
                } else
                {
                    var curCell = matrizObj[f][c].objurl;
                    if (!(prevCelda === curCell))
                    {
                        if (figLongitud >= 3)
                        {
                            figValidas += 1;
                            figFin = f - 1;
                            console.log("Combo vertical de " + figInicio + " a " + figFin + "!");
                            for (var ci = figInicio; ci <= figFin; ci++)
                            {
                                matrizObj[ci][c].enCombo = true;
                                matrizObj[ci][c].objurl = null;
                            }
                            puntos += points[figLongitud];
                            puntos += points[figValidas];
                        }
                        prevCelda = matrizObj[f][c].objurl;
                        figInicio = f;
                        figFin = null;
                        figLongitud = 1;
                        continue;
                    } else
                    {
                        figLongitud += 1;
                        if (f === (dimension - 1)) {
                            if (figLongitud >= 3)
                            {
                                figValidas += 1;
                                figFin = f;
                                console.log("Combo vertical de " + figInicio + " a " + figFin + "!");
                                for (var ci = figInicio; ci <= figFin; ci++)
                                {
                                    matrizObj[ci][c].enCombo = true;
                                    matrizObj[ci][c].objurl = null;
                                }
                                puntos += points[figLongitud];
                                puntos += points[figValidas];
                                prevCelda = null;
                                figInicio = null;
                                figFin = null;
                                figLongitud = 1;
                                continue;
                            }
                        } else {
                            prevCelda = matrizObj[f][c].objurl;
                            figFin = null;
                            continue;
                        }
                    }
                }

            }
        }

        var esCombo = false;
        for (var f = 0; f < dimension; f++) {
            for (var c = 0; c < dimension; c++)
                if (matrizObj[f][c].enCombo)
                {
                    console.log("Combo para eliminar: " + f + ',' + c);
                    esCombo = true;
                }
        }

        if (esCombo){          
            eliminarImagenes();            
        }
        else {
            console.log("NO COMBO");                      
        }      
        gameScore.mostrarImagenes();
    }

    function eliminarImagenes()
    {
        for (var f = 0; f < dimension; f++){
            for (var c = 0; c < dimension; c++){
                if (matrizObj[f][c].enCombo)  // Celda vacia
                {
                    matrizObj[f][c].o.animate({
                        opacity: 0
                    }, 700);
                }
            }                
        }
        actualizarPuntos();
            
        $(":animated").promise().done(function () {
            eliminarenMemoria();  
         });
       
        console.log("finaliza aqui en eliminarImagenes");
    }

    function eliminarenMemoria() {
        // mueve las celdas vacias hacia arriba.
        for (var f = 0; f < dimension; f++)
        {
            for (var c = 0; c < dimension; c++)
            {

                if (matrizObj[f][c].enCombo)  // Pregunta si la celda esta vacia
                {
                    matrizObj[f][c].o.html("");

                    matrizObj[f][c].enCombo = false;

                    for (var sr = f; sr >= 0; sr--)
                    {
                        if (sr === 0)
                            break; // no cambia porque es la primer fila

                        // cambio de las celdas
                        var tmp = matrizObj[sr][c].objurl;
                        matrizObj[sr][c].objurl = matrizObj[sr - 1][c].objurl;
                        matrizObj[sr - 1][c].objurl = tmp;
                    }

                }

            }

        }

        console.log("Fin de movimiento");

        //redibujando la grilla
        //y configurando el respawn		 					

        //Reseteando las celdas
        for (var f = 0; f < dimension; f++)
        {
            for (var c = 0; c < dimension; c++)
            {
                matrizObj[f][c].o.html("<img src='" + matrizObj[f][c].objurl + "' alt='" + f + "," + c + "'/>");
                matrizObj[f][c].o.css("opacity", 1);
                matrizObj[f][c].enCombo = false;
                if (matrizObj[f][c].objurl === null)
                    matrizObj[f][c].respawn = true;

                if (matrizObj[f][c].respawn === true)
                {

                    matrizObj[f][c].o.off("handleDragStart");
                    matrizObj[f][c].o.off("handleDropEvent");
                    matrizObj[f][c].o.off("handleDragStop");


                    matrizObj[f][c].respawn = false; // respawned!
                    console.log("Respawning " + f + "," + c);
                    matrizObj[f][c].objurl = gameScore.randomImage();

                    matrizObj[f][c].o.html("<img src='" + matrizObj[f][c].objurl + "' alt='" + f + "," + c + "'/>");


                    matrizObj[f][c].o.draggable(
                            {
                                containment: '.panel-tablero',
                                cursor: 'move',
                                zIndex: 100,
                                opacity: 0.85,
                                snap: '.panel-tablero',
                                stack: '.panel-tablero',
                                revert: true,
                                start: handleDragStart,
                                stop: handleDragStop
                            });
                    matrizObj[f][c].o.droppable(
                            {
                                drop: handleDropEvent
                            });
                }else{
                     matrizObj[f][c].o.css("opacity", 1);
                }
                
            }
        }

        console.log("Combo reseteados y recreados.");      
        // Verifica si existen otros combos
        gameScore.mostrarImagenes();
        seleccionaryEliminar();
        console.log("finaliza aqui en eliminarenMemoria");  
        gameScore.mostrarImagenes();
    }

    gameScore.init();
}());