
var imagenes = [
    'image/1.png', 'image/2.png', 'image/3.png', 'image/4.png'
];
var totalImagenes = imagenes.length;
var dimension = 7;
var puntos = [
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
                gameScore.startTime();
                //activarMovimientos();
                //seleccionaryEliminar();
            } else {
                gameScore.restart();
            }
        },
        restart: function(){
            var divTime = $('.time').css("display");
            if (divTime ==='none'){
                $('.panel-tablero').slideToggle("slow", function () {
                    gameScore.startTime();;
                });
                $('.time').show();
                $('.finalizacion').hide();
                $('.panel-score').css({'width': '25%'});
                $('.panel-score').resize({
                    animate: true
                });
            }else{
                this.startTime();
            }        
        },
        startTime: function() {
            tiempoRestante = tiempoJuego;
            tiempo = setTimeout(this.counterTimer(), 1000);
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
                      if (matriz[i][f].o.css("opacity")===0)
                      matriz[i][f].o.css("opacity", 1);                    
                  }                    
            }         
        },
        counterTimer: function() {
            tiempoRestante -= 1;
            actualizarTiempo();
            if (tiempoRestante === 0) {
                return this.finalizeTimer();
            }
            tiempo = setTimeout(this.counterTimer(), 1000);
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
    
    gameScore.init();
}());