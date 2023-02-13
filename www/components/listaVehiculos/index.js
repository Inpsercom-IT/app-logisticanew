'use strict';
var tamano = "";
var json_dataitem = "";
var arrestado = ["PENDIENTE","INICIADO"];
app.listaVehiculo = kendo.observable({
    init: function() {},
    onShow: function() { 
        /* Inicialza(); */
        try {
            localStorage.setItem("bandera", "1");
            document.getElementById("FechaInicioAE").style.width = "150" + "px";
            document.getElementById("FechaFinAE").style.width = "150" + "px";
            localStorage.setItem("numAutosAE", "");
            var fecha1 = new Date();
            var fecha = new Date();
            fecha1.setDate(fecha.getDate() - 8);
            var year = fecha.getFullYear();
            var mes = fecha.getMonth();
            var dia = fecha.getDate();
            var year1 = fecha1.getFullYear();
            var mes1 = fecha1.getMonth();
            var dia1 = fecha1.getDate();
            if (document.getElementById("FechaInicioAE").value == "") {
                document.getElementById("FechaInicioAE").value = dia1 + "-" + (mes1 + 1) + "-" + year1;
            }
            document.getElementById("FechaFinAE").value = dia + "-" + (mes + 1) + "-" + year;
            $("#FechaInicioAE").kendoDatePicker({
                ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
                min: new Date(1900, 0, 1),
                value: document.getElementById("FechaInicioAE").value,
                format: "dd-MM-yyyy",
                animation: {
                    close: {
                        effects: "fadeOut zoom:out",
                        duration: 300
                    },
                    open: {
                        effects: "fadeIn zoom:in",
                        duration: 300
                    }
                }
            });
            $("#FechaFinAE").kendoDatePicker({
                min: new Date(1900, 0, 1),
                value: new Date(),
                format: "dd-MM-yyyy"
            });
            //mes
            mesVehAE();
            //marcas
            marcaVheAE("KIA");
            //modelo
            if (localStorage.getItem("info").toString() !== "MOTIVO: no existen datos") {
                cboModeloVheAE("KIA", "A4");
            }else{
                var cboModelosHTML = "<p><select id='modelo2AE' class='w3-input w3-border textos'>";
                document.getElementById("divcboModeloAE").innerHTML = cboModelosHTML;
            } 
            cboestadoAE("PENDIENTE");
        } catch (error) {
            alert(error);
        }
     },
    afterShow: function() {}
});
app.localization.registerView('listaVehiculo');

function mesVehAE() {
    var cboMesVhHTML = "<p><select id='mes2AE' class='w3-input w3-border textos'>"
    cboMesVhHTML += "<option  value='00' selected>NINGUNO</option>"
    cboMesVhHTML += "<option  value='01'>ENERO</option>"
    cboMesVhHTML += "<option  value='02'>FEBRERO</option>"
    cboMesVhHTML += "<option  value='03'>MARZO</option>"
    cboMesVhHTML += "<option  value='04'>ABRIL</option>"
    cboMesVhHTML += "<option  value='05'>MAYO</option>"
    cboMesVhHTML += "<option  value='06'>JUNIO</option>"
    cboMesVhHTML += "<option  value='07'>JULIO</option>"
    cboMesVhHTML += "<option  value='08'>AGOSTO</option>"
    cboMesVhHTML += "<option  value='09'>SEPTIEMBRE</option>"
    cboMesVhHTML += "<option  value='10'>OCTUBRE</option>"
    cboMesVhHTML += "<option  value='11'>NOVIEMBRE</option>"
    cboMesVhHTML += "<option  value='12'>DICIEMBRE</option>";
        document.getElementById("divcbomesAE").innerHTML = cboMesVhHTML;      
}

function marcaVheAE(selMarca) {
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,"+localStorage.getItem("ls_idempresa").toLocaleString()+";IN;MARCAS;;;;;;";
    //"http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;IN;MARCAS;"
    var inforMarca;
    $.ajax({
        url: Url,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                inforMarca = (JSON.parse(data.ComboParametroEmpGetResult));
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
            return;
        }
    });
    var cboMarcaHTML = "<p><select id='marcas2AE' onchange='cboModeloVheAE(this.value)' class='w3-input w3-border textos'>";
    localStorage.setItem("info",inforMarca[0].CodigoClase);
    if (inforMarca.length > 0 && inforMarca[0].NombreClase !== "0") {
        var cboMarcaHTML = "<p><select id='marcas2AE' onchange='cboModeloVheAE(this.value)' class='w3-input w3-border textos'>";
        for (var i = 0; i < inforMarca.length; i++) {
            if (selMarca == inforMarca[i].CodigoClase) {
                cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "' selected>" + inforMarca[i].NombreClase + "</option>";
            }
            else {
                cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "'>" + inforMarca[i].NombreClase + "</option>";
            }
        }
        cboMarcaHTML += "</select>";
        document.getElementById("divcbomarcasAE").innerHTML = cboMarcaHTML;
    }
    else {
        document.getElementById("divcbomarcasAE").innerHTML = cboMarcaHTML;
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Marcas");
    }
}
function cboModeloVheAE(itmMarca, selModelo) {
    try {
      if (itmMarca != "") {
        var UrlCboModelos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/in/Inventarios.svc/in11ModelosGet/1,1;" + itmMarca;
        //"http://186.71.21.170:8077/taller/Services/in/Inventarios.svc/in11ModelosGet/1,1;" + itmMarca;
        var inforModelos = "";
        $.ajax({
            url: UrlCboModelos,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    inforModelos = JSON.parse(data.in11ModelosGetResult);
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Modelos");
                    return;
                }
            },
            error: function (err) {
                return;
            }
        });
        if (inforModelos.length > 0) {
            var cboModelosHTML = "<p><select id='modelo2AE' class='w3-input w3-border textos'>";
            cboModelosHTML += "<option  value=TODOS>TODOS(TODOS)</option>";
            var banDescr = 0;
            for (var i = 0; i < inforModelos.length; i++) {
                if (inforModelos[i].CodigoClase != " " || inforModelos[i].CodigoClase != "ninguna") {
                    if (selModelo == inforModelos[i].CodigoClase) {
                        cboModelosHTML += "<option  value='" + inforModelos[i].CodigoClase + "' selected>" + inforModelos[i].CodigoClase + " (" + inforModelos[i].NombreClase + ")" + "</option>";
                        banDescr = 1;
                    }
                    else {
                        cboModelosHTML += "<option  value='" + inforModelos[i].CodigoClase + "'>" + inforModelos[i].CodigoClase + " (" + inforModelos[i].NombreClase + ")" + "</option>";
                    }
                }
            }
            cboModelosHTML += "</select>";
        }
        else {
            cboModelosHTML = "<p><select id='modelo2AE' class='w3-input w3-border textos'>";
            cboModelosHTML += "<option  value=' '>Ninguna</option>";
            cboModelosHTML += "</select>";
        }
    }
    document.getElementById("divcboModeloAE").innerHTML = cboModelosHTML;
} catch (error) {
    alert(error);
}
}
function cboestadoAE(selEstado) {
    var cboMarcaHTML = "<p><select id='estado2AE' class='w3-input w3-border textos'>";
    for (var i = 0; i < arrestado.length; i++) {
        if (selEstado == arrestado[i]) {
            cboMarcaHTML += "<option  value='" + arrestado[i] + "' selected>" + arrestado[i] + "</option>";
        }
        else {
            cboMarcaHTML += "<option  value='" + arrestado[i] + "'>" + arrestado[i] + "</option>";
        }
    }
    cboMarcaHTML += "</select>";
    document.getElementById("divcboEstadoAE").innerHTML = cboMarcaHTML;
}

/*--------------------------------------------------------------------
Fecha: 13/12/2017
Descripcion: Se iniciaiza cuando guarda la informacion y al principio de la pagina
Parametros:
Creado: Edison Baquero
--------------------------------------------------------------------*/

function Inicialza() {
    var fechah = new Date();
    var fechad = sumarDias(fechah, 15);
    var fecha = new Date();
    var ddd = fechad.getDate();
    var ddh = fecha.getDate();
    var mmmd = fechad.getMonth() + 1;
    var mmmh = fecha.getMonth() + 1;
    var yyyyd = fechad.getFullYear();
    var yyyyh = fecha.getFullYear();
    if (ddd < 10) { ddd = '0' + ddd; }
    if (ddh < 10) { ddh = '0' + ddh; }
    if (mmmd < 10) { mmmd = '0' + mmmd; }
    if (mmmh < 10) { mmmh = '0' + mmmh; }
    var fechadesde = ddd + '-' + mmmd + '-' + yyyyd;
    var fechahasta = ddh + '-' + mmmh + '-' + yyyyh;
    LlenarTipoProducto();
    ConultaLista(fechadesde, fechahasta, "P", "EN_BODEGA");
}

/*-------------------------------------------------------------------
Fecha: 01/12/2017
Descripcion: Sumar y restar dias
Parametros:
Creado: Edison Baquero
--------------------------------------------------------------------*/
function sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
}

/*--------------------------------------------------------------------
Fecha: 01/12/2017
Descripcion: Llena combo del tipo de producto
Parametros:
Creado: Edison Baquero
--------------------------------------------------------------------*/
function LlenarTipoProducto() {
    var st_empresa = localStorage.getItem("ls_idempresa").toLocaleString();
    var url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/" + st_empresa + ",2" + ";FA;TIPO_PEDIDO;"
    var srtres = "";
    $.ajax({
        url: url,
        type: "GET",
        async: false,
        dataType: "json",
        success: function(data) {
            try {
                if (data.ComboParametroEmpGetResult != null) { srtres = (JSON.parse(data.ComboParametroEmpGetResult)); } else { srtres = ""; }
            } catch (e) {

                srtres = "";
            }
        },
        error: function(err) {
            srtres = "";
        }
    });

    if (srtres != "") {
        var cboAgenciaHTML = "<select id='cbotipoproductos' style='width:200px'>";
        cboAgenciaHTML += "<option value=''>Seleccione</option>";
        for (var i = 0; i < srtres.length; i++) {
            cboAgenciaHTML += "<option  value='" + srtres[i].CodigoClase + "'>" + srtres[i].NombreClase + "</option>";
        }
        cboAgenciaHTML += "</select>";
        document.getElementById("cbotipoproducto").innerHTML = cboAgenciaHTML;
        document.getElementById("cbotipoproducto").style.display = "block";
    }

}

/*--------------------------------------------------------------------
Fecha: 01/12/2017
Descripcion: Se valida si las fechas son validas o si fin es mayor a inicio
Parametros:
Creado: Edison Baquero
--------------------------------------------------------------------*/
function valida_fecha(fechadesde, fechahasta) {
    var valuesstar = fechadesde.split("-");
    var valuesend = fechahasta.split("-");
    var dateStart = new Date(valuesstar[2].substring(0, 4), (valuesstar[1] - 1), valuesstar[0]);
    var dateEnd = new Date(valuesend[2].substring(0, 4), (valuesend[1] - 1), valuesend[0]);
    if (dateStart > dateEnd) { return 0; }
    return 1;
}

/*--------------------------------------------------------------------
Fecha: 29/11/2017
Descripcion: Carga la informacion de las listas
Parametros:
Creado: Edison Baquero
--------------------------------------------------------------------*/
function ConultaListaVH(txtAnio,orden,FechaInicioAE,FechaFinAE,txtVIN,txtMes,txtMarca,txtModelo,estado) {
    
    try {
        if (txtModelo == "TODOS") {
            txtModelo="";            
        }
        document.getElementById("datoslistaVH").innerHTML="";
        var str_clave = "1,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";"+txtAnio+";" + txtMes +";" + orden + ";" + FechaInicioAE + ";" + 
        FechaFinAE + ";" + txtMarca + ";" + txtModelo + ";" + txtVIN + ";" + localStorage.getItem("ls_usulog").toLocaleString() + ";" + estado + ";";
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh77VehiculoGet/" + str_clave;
        //var Url = "http://200.63.221.180:8089/appk_aekia_pru/Services/VH/Vehiculos.svc/vh77VehiculoGet/1,json;2;;;;;;;;";
        //var Url1 = "http://200.63.221.180:8089/appk_aekia_pru/Services/VH/Vehiculos.svc/vh77VehiculoGet/"+ str_clave;
        var srtres = "";
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function(data) {
                try {

                    if (data.vh77VehiculoGetResult != null) { srtres = (JSON.parse(data.vh77VehiculoGetResult)).tvh77; } else { srtres = ""; }

                } catch (e) {

                    srtres = "";
                }
            },
            error: function(err) {
                srtres = "";
            }
        });
        tamano = srtres.length;
        if (srtres != "") {
            var nro_lista = (screen.width * 1) / 100;
            var fecha_lista = (screen.width * 2) / 100;
            var fecha_envio = (screen.width * 20) / 100;
           
            var tam_panatalla = (screen.width - 100);
        try {
            document.getElementById("datoslistaVH").innerHTML = "<div id='datoslistaVH' style='font-size:11px; display:none; margin:auto overflow-x: scroll;'></div>";
            
            $(document).ready(function() {
                var gridAE=$("#datoslistaVH").kendoGrid({
                dataSource: {
                    data: srtres,
                    pageSize: 20
                },
                scrollable: false,
                dataBound: onDataBound,
                persistSelection: true,
                pageable: true,
                columns: [
                    { title: "Sel", width: "2px", template: "# if (estado_instalacion !== 'PENDIENTE' ) { # <center><input id='ckbAE' class='checkbox' name='ckbAE' type='checkbox' checked/></center> # }else { # <center><input id='ckbAE' class='checkbox' name='ckbAE' type='checkbox'/> </center> #}#" },
                    { field: "chasis", title: "VIN",
                    attributes: {
                        style: "background-color: # if (semaforo === \'ROJO\') { # red # } else { if(semaforo === \'VERDE\'){ # green # }else { # yelow # } }#"
                    } },
                    { field: "fecha_wholesale", title: "Fecha Whole" },
                    { field: "punto_venta", title: "Punto venta" },
                    { field: "fecha_aprobacion", title: "Fecha aprobación alistamiento" },
                    { field: "leadtime", title: "Lead Time", 
                    attributes: {
                        style: "background-color: # if (semaforo === \'ROJO\') { # red # } else { if(semaforo === \'VERDE\'){ # green # }else { # yelow # } }#"
                    } },
                    { field: "modelo_comercial", title: "Modelo comercial"},
                    { field: "Motor", title: "Motor"},
                    { field: "FSC", title: "FSC"},
                    { field: "FORMA_pago", title: "Forma Pago"},
                    { field: "nombre_color", title: "COLOR"}, 
                ]}).data("kendoGrid");
            gridAE.table.on("click", ".checkbox" , selectRowAE);            
        });
        
        } catch (error) {
            alert(error);
        }
            document.getElementById("datoslistaVH").style.display = "block";
        } else {
            myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> AVISO</center>", "No existe registros. Para la fecha ingresada.");
            document.getElementById("datoslistaVH").style.display = "none";
        }   
        return;
    } catch (f) {
        LlenarTipoProducto();
        alert(f);
        return;
    }
}
var checkedIds = {};
    //on click of the checkbox:
    function selectRowAE() {
        try {
        var str_clave = "";
        var checked = this.checked,
        row = $(this).closest("tr"),
        gridAE = $("#datoslistaVH").data("kendoGrid"),
        dataItem = gridAE.dataItem(row);
       if (checked) {
            //-select the row
            row.addClass("k-state-selected");
            str_clave = "2,json;" + dataItem.codigo_empresa + ";"+dataItem.anio_vh76+";"+dataItem.mes_vh76+";" + dataItem.secuencia_vh76+ ";;;;;" + 
            dataItem.chasis + ";"+localStorage.getItem("ls_usulog").toLocaleString()+";";
            } else {
            //-remove selection
            row.removeClass("k-state-selected");
            str_clave = "3,json;" + dataItem.codigo_empresa +";"+dataItem.mes_vh76+";" + ";"+dataItem.anio_vh76+";" + dataItem.secuencia_vh76+ ";;;;;" + 
            dataItem.chasis + ";"+localStorage.getItem("ls_usulog").toLocaleString()+";";
        }
        grabarAE(str_clave)
    } catch (error) {
        alert(error);    
    }
    }

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

    function grabarAE(str_clave) {
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
                       buscarlistasVH(document.getElementById('txtAnio').value,document.getElementById('orden').value, document.getElementById('FechaInicioAE').value, document.getElementById('FechaFinAE').value, document.getElementById('txtVIN').value,document.getElementById('mes2AE').value,document.getElementById('marcas2AE').value,document.getElementById('modelo2AE').value,document.getElementById('estado2AE').value);
                   }
                   else{
                       alert(data.vh77VehiculoGetResult.toString());
                   }
                } catch (e) {

                    srtres = "";
                }
            },
            error: function(err) {
                srtres = "";
            }
        });
    }


/*--------------------------------------------------------------------
Fecha: 12/12/2017
Descripcion: Buscar  las vistas
Parametros:
Creado: Edison Baquero
--------------------------------------------------------------------*/

function buscarlistasVH(txtAnio,orden,FechaInicioAE,FechaFinAE,txtVIN,txtMes,txtMarca,txtModelo,estado) {
 try {
    kendo.ui.progress($("#listaVehiculoScreen"), true);
        setTimeout(function () {
        if (tamano > 0) {
            $("#datoslistaVH").data("kendoGrid").destroy();
        }
        
        ConultaListaVH(txtAnio,orden,FechaInicioAE,FechaFinAE,txtVIN,txtMes,txtMarca,txtModelo,estado);
        kendo.ui.progress($("#listaVehiculoScreen"), false);
    }, 2000);
} catch (error) {
    kendo.ui.progress($("#listaVehiculoScreen"), false);
   alert(error);  
}
}

/*--------------------------------------------------------------------
Fecha: 20/12/2017
Descripcion: Guarda el reverso
Parametros:
Creado: Edison Baquero
--------------------------------------------------------------------*/
function Reverso(sr_estadovs, dataItemdos) {
    try {

        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/FA/Mostrador.svc/fa60ListaSet";

        var modi = "";
        if (sr_estadovs == "EN_BODEGA") { modi = "2"; }
        if (sr_estadovs == "CONFIRMADO") { modi = "1"; }
        var griddata = {
            imodo: parseInt(modi),
            codigo_empresa: IsEmpty(dataItemdos.codigo_empresa) ? 0 : parseInt(dataItemdos.codigo_empresa),
            codigo_sucursal: IsEmpty(dataItemdos.codigo_sucursal) ? "" : dataItemdos.codigo_sucursal,
            codigo_agencia: IsEmpty(dataItemdos.codigo_agencia) ? "" : dataItemdos.codigo_agencia,
            tipo_pedido: IsEmpty(dataItemdos.tipo_pedido) ? "" : dataItemdos.tipo_pedido,
            persona_numero: IsEmpty(dataItemdos.persona_numero) ? 0 : parseInt(dataItemdos.persona_numero),
            nro_lista: IsEmpty(dataItemdos.nro_lista) ? 0 : parseInt(dataItemdos.nro_lista),
            fecha_lista: IsEmpty(dataItemdos.fecha_lista) ? "" : dataItemdos.fecha_lista,
            usuario_lista: IsEmpty(dataItemdos.usuario_lista) ? "" : dataItemdos.usuario_lista,
            hora_lista: IsEmpty(dataItemdos.hora_lista) ? "" : dataItemdos.hora_lista,
            estado: IsEmpty(dataItemdos.estado) ? "" : dataItemdos.estado,
            referencia_pedido: IsEmpty(dataItemdos.referencia_pedido) ? "" : dataItemdos.referencia_pedido,
            fecha_confirmacion: IsEmpty(dataItemdos.fecha_confirmacion) ? "" : dataItemdos.fecha_confirmacion,
            usuario_confirmacion: IsEmpty(dataItemdos.usuario_confirmacion) ? "" : dataItemdos.usuario_confirmacion,
            hora_confirmacion: IsEmpty(dataItemdos.hora_confirmacion) ? "" : dataItemdos.hora_confirmacion,
            estado_impresion: IsEmpty(dataItemdos.estado_impresion) ? "" : dataItemdos.estado_impresion,
            fecha_impresion: IsEmpty(dataItemdos.fecha_impresion) ? "" : dataItemdos.fecha_impresion,
            hora_impresion: IsEmpty(dataItemdos.hora_impresion) ? "" : dataItemdos.hora_impresion,
            usuario_impresion: IsEmpty(dataItemdos.usuario_impresion) ? "" : dataItemdos.usuario_impresion,
            numero_impresion: IsEmpty(dataItemdos.numero_impresion) ? 0 : parseInt(dataItemdos.numero_impresion),
            fecha_envio_bodega: IsEmpty(dataItemdos.fecha_envio_bodega) ? "" : dataItemdos.fecha_envio_bodega,
            usuario_envio_bodega: IsEmpty(dataItemdos.usuario_envio_bodega) ? "" : dataItemdos.usuario_envio_bodega,
            hora_envio_bodega: IsEmpty(dataItemdos.hora_envio_bodega) ? "" : dataItemdos.hora_envio_bodega,
            usuario_autorizador: IsEmpty(dataItemdos.usuario_autorizador) ? "" : dataItemdos.usuario_autorizador,
            fecha_autorizacion: IsEmpty(dataItemdos.fecha_autorizacion) ? "" : dataItemdos.fecha_autorizacion,
            hora_autorizacion: IsEmpty(dataItemdos.hora_autorizacion) ? "" : dataItemdos.hora_autorizacion,
            cupo_credito: IsEmpty(dataItemdos.cupo_credito) ? 0 : parseFloat(dataItemdos.cupo_credito),
            forma_pago_tg92: IsEmpty(dataItemdos.forma_pago_tg92) ? "" : dataItemdos.forma_pago_tg92,
            saldo_credito: IsEmpty(dataItemdos.saldo_credito) ? 0 : parseFloat(dataItemdos.saldo_credito),
            fecha_credito: IsEmpty(dataItemdos.fecha_credito) ? "" : dataItemdos.fecha_credito,
            hora_credito: IsEmpty(dataItemdos.hora_credito) ? "" : dataItemdos.hora_credito,
            saldo_entrega: IsEmpty(dataItemdos.saldo_entrega) ? 0 : parseFloat(dataItemdos.saldo_entrega),
            anio_fa08: IsEmpty(dataItemdos.anio_fa08) ? 0 : parseInt(dataItemdos.anio_fa08),
            numero_secuencia_fa08: IsEmpty(dataItemdos.numero_secuencia_fa08) ? 0 : parseInt(dataItemdos.numero_secuencia_fa08),
            numero_factura: IsEmpty(dataItemdos.numero_factura) ? "" : dataItemdos.numero_factura,
            subtotal: IsEmpty(dataItemdos.subtotal) ? 0 : parseFloat(dataItemdos.subtotal),
            porcentaje_iva: IsEmpty(dataItemdos.porcentaje_iva) ? 0 : parseFloat(dataItemdos.porcentaje_iva),
            total_iva: IsEmpty(dataItemdos.total_iva) ? 0 : parseFloat(dataItemdos.total_iva),
            valor_total: IsEmpty(dataItemdos.valor_total) ? 0 : parseFloat(dataItemdos.valor_total),
            area_fiscal: IsEmpty(dataItemdos.area_fiscal) ? "" : dataItemdos.area_fiscal,
            concesionario_repuestos: IsEmpty(dataItemdos.concesionario_repuestos) ? "" : dataItemdos.concesionario_repuestos,
            persona_numero_factura: IsEmpty(dataItemdos.persona_numero_factura) ? 0 : parseInt(dataItemdos.persona_numero_factura),
            fecha_creacion: IsEmpty(dataItemdos.fecha_creacion) ? "" : dataItemdos.fecha_creacion,
            hora_creacion: IsEmpty(dataItemdos.hora_creacion) ? "" : dataItemdos.hora_creacion,
            usuario_creacion: IsEmpty(dataItemdos.usuario_creacion) ? "" : dataItemdos.usuario_creacion,
            prog_creacion: IsEmpty(dataItemdos.prog_creacion) ? "" : dataItemdos.prog_creacion,
            fecha_modificacion: IsEmpty(dataItemdos.fecha_modificacion) ? "" : dataItemdos.fecha_modificacion,
            hora_modificacion: IsEmpty(dataItemdos.hora_modificacion) ? "" : dataItemdos.hora_modificacion,
            usuario_modificacion: IsEmpty(dataItemdos.usuario_modificacion) ? "" : dataItemdos.usuario_modificacion,
            prog_modificacion: IsEmpty(dataItemdos.prog_modificacion) ? "" : dataItemdos.prog_modificacion,
            estado_empate: IsEmpty(dataItemdos.estado_empate) ? "" : dataItemdos.estado_empate
        };
        var reslutado_final = "";
        var spres = "";
        $.ajax({
            url: Url,
            type: "POST",
            data: JSON.stringify(griddata),
            async: false,
            dataType: "json",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function(datas) {
                 try {
                    var estado = datas.substr(0, 1) == "1"
                    if (estado == "1") {
                        spres = "1";
                        reslutado_final = "Se reverso el registro";
                    } else {
                        spres = "5";
                        reslutado_final = "Se reverso el registro";
                    }
                    
                } catch (s) {
                    spres = "2";
                    reslutado_final = "Error al ingresar la infomaci&oacute;n.";
                }
            },
            error: function(err) {
                spres = "4";
                reslutado_final = "Error al ingresar la infomaci&oacute;n.";
            }
        });
        var fechainicio = document.getElementById('dpInicio').value;
        var fechafin = document.getElementById('dpFin').value;
        var tipoprod = document.getElementById('cbotipoproductos').options[document.getElementById('cbotipoproductos').selectedIndex].value;
        var estatus = document.getElementById('SelectedStatus').options[document.getElementById('SelectedStatus').selectedIndex].value;

        ConultaListaVH(orden,FechaInicioAE,FechaFinAE,txtVIN,txtMes,txtMarca,txtModelo,estado);

    } catch (f) { myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", f); }

}

/*--------------------------------------------------------------------
Fecha: 21/12/2017
Descripcion: Validar el objeto 
Parametros:
Creado: Edison Baquero
--------------------------------------------------------------------*/
function IsEmpty(obj) {
    var isEmpty = false;
    if (typeof obj == 'undefined' || obj === null || obj === '') {
        isEmpty = true;
    }

    if (typeof obj == 'number' && isNaN(obj)) {
        isEmpty = true;
    }

    if (obj instanceof Date && isNaN(Number(obj))) {
        isEmpty = true;
    }

    if (obj == "NaN") { isEmpty = true; }

    return isEmpty;
}