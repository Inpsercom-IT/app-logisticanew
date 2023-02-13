'use strict';
var tamanoDV = "";
var json_dataitem = "";
var arrMenuAbierto = ["GRABAR","NOVEDAD"];
app.despacharVehiculo = kendo.observable({
    init: function() {},
    onShow: function() { 
        /* Inicialza(); */
        try {
            if (localStorage.bandera == "1") {
            try {
                document.getElementById('txtVINDV').value = "";
                document.getElementById("datoslistaDV").innerHTML = "";
                //localStorage.setItem("bandera", "0");
                //$("#datoslistaDV").data("kendoGrid").destroy();
            } catch (error) {
                alert(error);
            }
        }
            if (localStorage.getItem("banderaRe") != undefined) {
                if (localStorage.getItem("banderaRe").toString()=="1") {
                    ConultaListaDV(document.getElementById('txtVINDV').value);
                    localStorage.setItem("banderaRe","0");              
                }else{
                    document.getElementById('txtVINDV').value = "";
                    document,getElementById("datoslistaDV").innerHTML = "";
                }  
            } 
            localStorage.setItem("bandera", "1");
            localStorage.setItem("numAutosAE", "");
            llamarNuevoestilo("btn_buscar_consultaDV");
            llamarNuevoestiloIconB("icn_buscar_consultaDV");
        } catch (error) {
            alert(error);
        }
     },
    afterShow: function() {}
});
app.localization.registerView('despacharVehiculo');

function scan() {
    var that = this;
        try {
            try {
                localStorage.removeItem("codigoIMEI");
            } catch (error) {
                
            }
           // alert("entro");
            if (window.navigator.simulator === true) {
                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";

                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Aplicaci\u00F3n no compatible.");
            } else {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        //alert(result);
                        try {
                        if (!result.cancelled) {
                            //alert(result.text);
                            $("#txtVINDV").val(result.text);
                            document.getElementById("txtVINDV").innerHTML = result.text;
                            localStorage.setItem("codigoIMEI", result.text);
                            //that._addMessageToLog(result.format, result.text);
                            //buscaPlacaVINING(document.getElementById('infoPlacasVINING').value);
                            buscarlistasDV(result.text);
                        }
                    } catch (error) {
                          alert(error);  
                    }
                    },
                    function (error) {
                        // ERROR: SCAN  is already in progress   
                        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se realiz\u00F3 el escaneo. Intentelo nuevamente.");

                    });
            }
        } catch (e) {
            //alert(e);
        }
}

function buscarlistasDV(txtVIN) {
    try {
       var tama;
        try {
            tama = txtVIN.length;
        } catch (e) {
            tama = 1;
        }
        
        if (txtVIN == "" || txtVIN == null || tama < 6 ) {
            alert("Vin debe ser minimo de 6 caracteres");
            return;
        } else {         
       kendo.ui.progress($("#despacharVehiculoScreen"), true);
           setTimeout(function () {
           if (tamanoDV > 0) {
               //$("#datoslistaDV").data("kendoGrid").destroy();
               //alert("0");
           }
           ConultaListaDV(txtVIN);
           kendo.ui.progress($("#despacharVehiculoScreen"), false);
       }, 2000);
    }
   } catch (error) {
    kendo.ui.progress($("#despacharVehiculoScreen"), false);
      alert(error);  
   }
}


// START_CUSTOM_CODE_listaentrega
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_listaentrega

/*--------------------------------------------------------------------
Fecha: 29/11/2017
Descripcion: Carga la informacion de las listas
Parametros:
Creado: Edison Baquero
--------------------------------------------------------------------*/
function ConultaListaDV(txtVIN) {
    
    try {
        var str_clave = "6,json;" + localStorage.getItem("ls_idempresa").toLocaleString() +";;;;"+ txtVIN +";;;;;;;";
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh01VehiculoGet/" + str_clave;
        var srtres = "";
        //alert(Url);
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function(data) {
                try {
                    if (data.vh01VehiculoGetResult != null) { srtres = (JSON.parse(data.vh01VehiculoGetResult)).tvh01; } else { srtres = ""; }
                } catch (e) {
                    srtres = "";
                }
            },
            error: function(err) {
                srtres = "";
            }
        });
        tamanoDV = srtres.length;
        // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(srtres[0]));
        if (srtres != "") {
            var tam_panatalla = (screen.width - 100);
           try {
            document.getElementById("datoslistaDV").innerHTML = "<div id='datoslistaDV' style='font-size:11px; display:none; margin:auto overflow-x: scroll;'></div>";
            $(document).ready(function() {
                var grid=$("#datoslistaDV").kendoGrid({
                dataSource: {
                    data: srtres,
                    pageSize: 20
                },
                scrollable: false,
                dataBound: onDataBound,
                persistSelection: true,
                pageable: true,
                sortable: true,
                
                width: tam_panatalla + "px",
                columns: [
                    { title: "Grabar", width: 11,
                    command: [{
                        name: "nuevo",text: "",imageClass: "fa fa-undo",
                        visible: function (dataItem) { return dataItem.estado_recepcion == "POR RECEPCIONAR" }, 
                         click: function (emo03) {
                            try {
                                var dataItem = this.dataItem($(emo03.currentTarget).closest("tr"));
                                emo03.preventDefault();
                                nuevoMenu(dataItem);
                            }
                            catch (fmo3) {
                                kendo.ui.progress($("#admOtScreen"), false);
                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo3);
                                return;
                            }
                        }
                    }],
                    },
                    { field: "chasis", title: "Vin" },
                    { field: "codigo_marca", title: "Marca" },
                    { field: "codigo_modelo", title: "Modelo" },
                    { field: "codigo_sucursal", title: "Sucursal" },
                    { field: "codigo_agencia", title: "Agencia" },
                    { field: "color_vehiculo", title: "Color" },
                    { field: "numero_motor", title: "Motor"},
                    { field: "estado_recepcion ", title: "Estado Recepción"},
                    { title: "Fotos Videos", width: 11,
                        command: [{ name: "fotosALI", text: "", imageClass: "fa fa-file-text-o",
                            click: function (emo04) {
                                try {
                                    var dataItemCC = this.dataItem($(emo04.currentTarget).closest("tr"));
                                    emo04.preventDefault();
                                    localStorage.setItem("fotosviedeosALI", JSON.stringify(dataItemCC));
                                    kendo.mobile.application.navigate("components/fotosVideos/view.html");
                                    //kendo.ui.progress($("#controlCalidadScreen"), true);
                                }
                                catch (fmo4) {
                                    kendo.ui.progress($("#controlCalidadScreen"), false);
                                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo4);
                                    return;
                                }
                            }
                        }],
                    },          
                ]

            }).data("kendoGrid");
            
            //bind click event to the checkbox   onclick='mio(this);'
            //grid.table.on("click", ".checkbox" , selectRow);            
        });
        } catch (error) {
            alert(error);
        }
            document.getElementById("datoslistaDV").style.display = "block";
        } else {
            kendo.ui.progress($("#admOtScreen"), false);
            myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> AVISO</center>", "No existe registros. Para la fecha ingresada.");
            document.getElementById("datoslistaDV").style.display = "none";
        }
        
        return;
    } catch (f) {
        alert(f);
        return;
    }
}
var checkedIds = {};

    //on click of the checkbox:
    /* function selectRow() {
        var str_clave = "";
        var checked = this.checked,
        row = $(this).closest("tr"),
        grid = $("#datoslistaDV").data("kendoGrid"),
        dataItem = grid.dataItem(row);
        alert(inspeccionar(dataItem));
        //alert(localStorage.getItem("ls_usulog").toLocaleString());
       if (checked) {
            //-select the row
            row.addClass("k-state-selected");
            str_clave = "4,json;" + dataItem.codigo_empresa + ";" + dataItem.mes_vh76 + ";" + ";" + dataItem.anio_vh76 + ";" + dataItem.secuencia_vh76+ ";;;;;" + 
            dataItem.chasis + ";"+localStorage.getItem("ls_usulog").toLocaleString()+";";
            } else {
            //-remove selection
            row.removeClass("k-state-selected");
            str_clave = "5,json;" + dataItem.codigo_empresa + ";" + dataItem.mes_vh76 + ";" + ";"+dataItem.anio_vh76+";" + dataItem.secuencia_vh76+ ";;;;;" + 
            dataItem.chasis + ";"+localStorage.getItem("ls_usulog").toLocaleString()+";";
        }
        grabarDV(str_clave)
    } */

    //on dataBound event restore previous selected rows:
    function onDataBound(e) {
        var view = this.dataSource.view();
        for(var i = 0; i < view.length;i++){
            if(checkedIds[view[i].id]){
                this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                .addClass("k-state-selected")
                .find(".checkbox")
                .attr("checked","checked");
            }
        }
    }

    /* function grabarDV(str_clave) {
        try {
            
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh77VehiculoGet/" + str_clave;
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function(data) {
                try {
                    if(data.vh77VehiculoGetResult.toString() == "1,Success"){
                       alert("se actualizo los datos");
                       buscarlistasDV(document.getElementById('txtAnioDV').value,document.getElementById('ordenDV').value, document.getElementById('FechaInicioDV').value, document.getElementById('FechaFinDV').value, document.getElementById('txtVINDV').value,document.getElementById('marcas2DV').value,document.getElementById('modelo2DV').value,document.getElementById('estado2DV').value);
                       //ConultaListaDV(txtAnio,orden,FechaInicioAE,FechaFinAE,txtVIN,txtMarca,txtModelo,estado)
                   }else{
                    myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> AVISO</center>", data.vh77VehiculoGetResult.toString().substring(2,data.vh77VehiculoGetResult.length));
                    buscarlistasDV(document.getElementById('txtAnioDV').value,document.getElementById('ordenDV').value, document.getElementById('FechaInicioDV').value, document.getElementById('FechaFinDV').value, document.getElementById('txtVINDV').value,document.getElementById('marcas2DV').value,document.getElementById('modelo2DV').value,document.getElementById('estado2DV').value);

                   }
                } catch (e) {

                    srtres = "";
                }
            },
            error: function(err) {
                srtres = "";
            }
        });
    } catch (error) {
         alert(error);   
    }
    
    } */

    function nuevoMenu(dataItem){
        localStorage.setItem("dataMN", JSON.stringify(dataItem));
        
        var htmlrbMenu = ""; 
        for(var i = 0; i < arrMenuAbierto.length; i++){
            if(arrMenuAbierto[i] == "GRABAR"){
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuAbierto[i] + "' onclick='cambiaMN(this.value);'><strong><FONT SIZE=6> " + arrMenuAbierto[i] + "</FONT></strong></p>";
            }
            if(arrMenuAbierto[i] == "NOVEDAD"){  
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuAbierto[i] + "' onclick='cambiaMN(this.value);'><strong><FONT SIZE=6> " + arrMenuAbierto[i] + "</FONT></strong></p>";
            }        
            
        }
        var dialogMN = $("#dialogMN").kendoDialog({
            width: "350px",
            buttonLayout: "normal",
            title: "<center><i class=\"fa fa-play\"></i> MENU GRABAR</center>",
            closable: false,
            modal: false,
            content: htmlrbMenu,
            actions: [
                //{ text: '<font style=\"font-size:12px\"> <button  class=\"w3-btn w3-red\"> &nbsp;&nbsp;ELEGIR&nbsp;&nbsp;</button></font>', action: accCambioMN },
                { text: '<font style=\"font-size:12px\"><button id="btnCancelarLG0"  class=\"w3-btn\"> CANCELAR</button></font>', primary: true }
            ]
        });
        dialogMN.data("kendoDialog").open();
        llamarNuevoestilo("btnCancelarLG");
    }

    function cambiaMN(e){
        try {
            var dataMenu = JSON.parse(localStorage.getItem("dataMN")); 
            switch(e){
                case arrMenuAbierto[0]: 
                    kendo.ui.progress($("#despacharVehiculoScreen"), true);
                    setTimeout(function () {
                        try {
                            //var dataItemNove = JSON.parse(localStorage.getItem("dataItem"));
                            var dataItemNove = JSON.parse(localStorage.getItem("dataMN"));
                            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/2,;" + 
                            localStorage.getItem("ls_idempresa").toLocaleString()+ ";" + dataItemNove.chasis + ";";
                            var resul="";
                            //alert(Url);
                            $.ajax({
                                url: Url,
                                type: "GET",
                                dataType: "json",
                                async: false,
                                success: function (datos1) {
                                    try {
                                        if (datos1.qvh70SmsGetResult == "1,Success") {
                                        alert("DATOS GUARDADOS");
                                        }
                                        else{
                                            alert(inspeccionar(datos1));
                                        }
                                    }
                                    catch (e) {
                                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(e));
                                        respPar = "error";
                                    }
                                },
                                error: function (err) {
                                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                                    respPar = "error";
                                }
                            });
                        } catch (error) {
                            alert(error);
                        }
                        ConultaListaDV(dataMenu.chasis);
                        kendo.ui.progress($("#despacharVehiculoScreen"), false);
                    }, 2000);
                    break;
                case arrMenuAbierto[1]: 
                    localStorage.setItem("dataItem", JSON.stringify(dataMenu));
                    kendo.mobile.application.navigate("components/novedades/view.html");
                break;
            }
            var dialogMN = $("#dialogMN").data("kendoDialog");
            dialogMN.close();
        }catch (error) {
            alert(error);
        }    
    }