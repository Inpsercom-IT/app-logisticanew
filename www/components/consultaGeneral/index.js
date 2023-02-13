app.consultaG = kendo.observable({
    onShow: function () {
        localStorage.setItem("bandera","1");
    },
    afterShow: function () {
    }
});

app.localization.registerView('consultaG');

// START_CUSTOM_CODE_lector_barras
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
function buscaPlacaVINAE(placaVIN) {
    // Destruye el grid
    try {
        // Grid detalle ot
        var grid = $("#gridconsultaAE").data("kendoGrid");
        grid.destroy();
    }
    catch (ex) {
    }
    // Borrar imagen de placa
    if (document.getElementById('infoPlacasVINAE').value != "") {

        kendo.ui.progress($("#consultaGScreen"), true);
        setTimeout(function () {
            // precarga----------------------------
            if (placaVIN.includes("*") == true) {
            }
            else {
                if (placaVIN.length > 8) {
                    var patron = /^\d*$/;
                    if (patron.test(placaVIN)) {
                        TraerInformacionAE(placaVIN, "O");
                    }
                    else {
                        // Busca la placa con los datos del cliente de cita
                        TraerInformacionAE(placaVIN, "C");
                    }
                }
                else {
                    // Busca la placa con los datos del cliente de cita
                    TraerInformacionAE(placaVIN, "P");
                }
                
            }
        }, 2000); 
    }
    else {
        // loading
        document.getElementById("divLoading").innerHTML = "";
        // Borrar imagen de placa
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese la Placa o VIN");
    }
}

function TraerInformacionAE(responseText, tipo) {
    try {
        var Url = "";
        var InforAE = "";
        var recurrenteOT = 0;
        var errorConex = false;
        var cllave = "1,json;"+localStorage.getItem("ls_idempresa").toLocaleString()+";"+responseText+";"+localStorage.getItem("ls_usulog").toLocaleString();
        if (tipo == "P") {
            // Placa
            Url = localStorage.getItem("ls_url2").toLocaleString()  + "/Services/VH/Vehiculos.svc/vh51VehiculoGet/"+cllave;
        } else if (tipo == "C") {
            // Chasis
            Url = localStorage.getItem("ls_url2").toLocaleString()  + "/Services/VH/Vehiculos.svc/vh51VehiculoGet/"+cllave;
        }
        else {
            // OT
            Url = localStorage.getItem("ls_url2").toLocaleString()  + "/Services/VH/Vehiculos.svc/vh51VehiculoGet/"+cllave;
        }
         $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    var aux = JSON.stringify(data.vh51VehiculoGetResult);
                    if (aux.substr(1,1) == "0") {
                        alert(JSON.stringify(data.vh51VehiculoGetResult));
                    } else {
                        InforAE = (JSON.parse(data.vh51VehiculoGetResult)).tvh51;
                    }
                } catch (e) {
                    recurrenteOT = 1;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#consultaGScreen"), false);
                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                 errorConex = true;
             return;
            }
        });
        

        if (errorConex == true) {
            //vaciaCampos();
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No existe conexi&oacute;n con el servicio Taller</center>");
            return;
        }
        // Si no existe data envia mensaje de error
        
          if (inspeccionar(InforAE).substring(0,1) == "0") {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos para el registro <b>" + responseText + "</b>");
        }
        if (recurrenteOT < 1) {
            var tam_panatalla = (screen.width - 100);
            for (let index = 0; index < InforAE.length; index++) {
                InforAE[index].CONTROL_alistamiento="postea"+index   
            }
            var grid = $("#gridconsultaAEC").kendoGrid({
                dataSource: {
                    data: InforAE,
                    pageSize: 20
                },
                scrollable: false,
                dataBound: onDataBound,
                persistSelection: true,
                pageable: true,
                sortable: true,
                
                width: tam_panatalla + "px",
                columns: [
                    { field: "postea", title: "Postea", template: "<input type='radio' id='#: CONTROL_alistamiento #' name='#: CONTROL_alistamiento #' #= estado_posteo == 'ALISTADO' ? 'checked=checked' : '' #  value='0' onclick='SetPostear(this);' />" }, 
                    { field: "con_novedad", title: "Novedad", template: "<input type='radio' id='#: CONTROL_alistamiento #' name='#: CONTROL_alistamiento #' #= estado_posteo == 'NO_ALISTADO' ? 'checked=checked' : '' #  value='1' onclick='SetNovedad(this);' />" }, 
                    { field: "estado_posteo", title: "Ninguno", template: "<input type='radio' id='#: CONTROL_alistamiento #' name='#: CONTROL_alistamiento #' #= estado_posteo == '' && observacion_posteo == '' ? 'checked=checked' : '' #  value='2' onclick='SetNinguno(this);' />" }, 
                    { field: "nombre_item", title: "NOMBRE" },
                    { field:"tipo_registro", title:"TIPO REGISTRO"},
                    { field: "prefijo_catalogo  +'          '+  partno_proveedor", title: "CODIGO ITEM"},
                    { field: "cantidad", title: "CANTIDAD" },
                    { field: "nombre_kit", title: "NOMBRE KIT" },
                    { field: "prefijo_catalogo_kit  +'          '+  partno_proveedor_kit", title: "CODIGO KIT" }, 
                    { field:"estado_posteo", title:"ESTADO"},
                    { field:"responsable_accesorio", title:"RESPONSABLE"},
                    { field:"observacion_posteo", title:"OBSERVACION"}
                ]          
            }).data("kendoGrid");
    }
    } catch (e) {
        alert("aqui"+e);
    }
    kendo.ui.progress($("#consultaGScreen"), false);
}
function SetPostear(item) {
    var grid = $("#gridconsultaAEC").data("kendoGrid");
    var row = $(item).closest("tr");
    var dataItem1 = grid.dataItem(row);
    dataItem1.observacion_posteo = "";
    dataItem1.estado_posteo = "ALISTADO";
    var saveinfo = GuardarInformacionAE(dataItem1);
    var estado = saveinfo.substr(0, 1);
    if (estado == "1") {
        TraerInformacionAE(dataItem1.chasis, "C");
    } else {
        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error al guardar la infomaci&oacute;n.");
    }
}

function SetNinguno(item) {
    var grid = $("#gridconsultaAEC").data("kendoGrid");
    var row = $(item).closest("tr");
    var dataItem1 = grid.dataItem(row);
    dataItem1.observacion_posteo = "";
    dataItem1.estado_posteo = "";
    var saveinfo = GuardarInformacionAE(dataItem1);
    var estado = saveinfo.substr(0, 1);
    if (estado == "1") {
        TraerInformacionAE(dataItem1.chasis, "C");
    } else {
        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error al guardar la infomaci&oacute;n.");
    }
    TraerInformacionAE(dataItem1.chasis, "C");
}
function SetNovedad(item) {
    try {
        localStorage.removeItem("chec");
    } catch (error) {
        
    }
    var grid = $("#gridconsultaAEC").data("kendoGrid");
    var row = $(item).closest("tr");
    var dataItem2 = grid.dataItem(row);
    if (dataItem2.estado_posteo == "NO_ALISTADO") {
        localStorage.setItem("chec",true);
    } else {
        localStorage.setItem("chec",false);
    }
    
    var nombre_item = dataItem2.nombre_item;
    var titulo_novedad = nombre_item + "<br>";
    localStorage.setItem("nombreC",dataItem2.CONTROL_alistamiento);
    document.getElementById('lbl_titulo_novedad').innerHTML = titulo_novedad;
    marcaVheAEC("");
    document.getElementById('divcbomarcasAEC').focus();
    document.getElementById('details_con_novedad').style.display = "block"; 
    json_dataitem = dataItem2;
}
/*--------------------------------------------------------------------
Fecha: 18/12/2017
Descripcion: Guardar los datos de con novedad
Parametros:
Creado: Edison Baquero // no se utiliza
--------------------------------------------------------------------*/
function GuardarConNovedad(int_cambio) {
    try {
        if (int_cambio != "" && int_cambio != "0,0") {
            var st_dataitem = json_dataitem;
            st_dataitem.estado_posteo = "NO_ALISTADO";
            st_dataitem.observacion_posteo = int_cambio;
            var saveinfo = GuardarInformacionAE(st_dataitem);
            var estado = saveinfo.substr(0, 1);
            if (estado == "1") {
                regresarconnovedad();
                TraerInformacionAE(st_dataitem.chasis, "C");
            } else {
                myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> AVISO</center>", "Error al actualizar infroamción");
            }
        } else {
            myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> AVISO </center>", "Debe seleccionar una opción.");
        }
    } catch (f) {
        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR </center>", f);
    }
}
/*--------------------------------------------------------------------
Fecha: 18/12/2017
Descripcion: Funcion que permite regresar a la lista de 
Parametros:
Creado: Edison Baquero // no se utiliza
--------------------------------------------------------------------*/
function regresarconnovedad() {
    try {
    document.getElementById('details_con_novedad').style.display = "none";
    document.getElementById('divcbomarcasAEC').value = "";
    document.getElementById('marcas2AEC').value = "";
    if (localStorage.getItem("chec")) { 
        document.getElementsByName(localStorage.getItem("nombreC")).value = "1";
    } else {
        document.getElementsByName(localStorage.getItem("nombreC")).value = "2";
    }
    var grid = $("#gridconsultaAEC").data("kendoGrid");
    grid.refresh();
} catch (error) {
      alert(error);  
}
    
}

function marcaVheAEC(selMarca) {
    
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,"+localStorage.getItem("ls_idempresa").toLocaleString()+";VH;CAUSAL_NO_ALISTAMIENTO;;;;;;";
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
    localStorage.setItem("info",inforMarca[0].CodigoClase);
    if (inforMarca.length > 0 && inforMarca[0].NombreClase !== "0") {
        var cboMarcaHTML = "<p><select id='marcas2AEC' class='w3-input w3-border textos'>";
        cboMarcaHTML += "<option value='0,0'>Seleccione</option>";
        for (var i = 0; i < inforMarca.length; i++) {
            if (selMarca == inforMarca[i].CodigoClase) {
                cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "' selected>" + inforMarca[i].NombreClase + "</option>";
            }
            else {
                cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "'>" + inforMarca[i].NombreClase + "</option>";
            }
        }
        cboMarcaHTML += "</select>";
        document.getElementById("divcbomarcasAEC").innerHTML = cboMarcaHTML;
    }
    else {
        document.getElementById("divcbomarcasAEC").innerHTML = cboMarcaHTML;
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Marcas");
    }
}

function GuardarInformacionAE(datag) {
    var valres = "";
    try {
        var errorConex = false;
        var cllave = "2,json;"+localStorage.getItem("ls_idempresa").toLocaleString()+";"+datag.chasis+";"+localStorage.getItem("ls_usulog").toLocaleString()
        var urlGuardar = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh51VehiculoSet";
        var i = 0;
        var griddata = {
            "codigo_empresa": datag.codigo_empresa,
            "codigo_sucursal": datag.codigo_sucursal,
            "codigo_agencia": datag.codigo_agencia,
            "chasis": datag.chasis,
            "secuencia_vh51": datag.secuencia_vh51,
            "codigo_importacion": datag.codigo_importacion,
            "codigo_marca": datag.codigo_marca,
            "codigo_modelo": datag.codigo_modelo,
            "fsc": datag.fsc,
            "prefijo_catalogo": datag.prefijo_catalogo,
            "partno_proveedor": datag.partno_proveedor,
            "cantidad": datag.cantidad,
            "responsable_accesorio": datag.responsable_accesorio,
            "tipo_accesorio": datag.tipo_accesorio,
            "prefijo_catalogo_kit": datag.prefijo_catalogo_kit,
            "partno_proveedor_kit": datag.partno_proveedor_kit,
            "anio_vh52": datag.anio_vh52,
            "numero_entrega_vh52": datag.numero_entrega_vh52,
            "costo_entrega": datag.costo_entrega,
            "fecha_solicitud": datag.fecha_solicitud,
            "hora_solicitud": datag.hora_solicitud,
            "usuario_solicitud": datag.usuario_solicitud,
            "estado": datag.estado,
            "proceso": datag.proceso,
            "bodega_acc_ent": datag.bodega_acc_ent,
            "bodega_acc_x_fac": datag.bodega_acc_x_fac,
            "bodega_venta": datag.bodega_venta,
            "anio_fa08": datag.anio_fa08,
            "numero_secuencia_fa08": datag.numero_secuencia_fa08,
            "numero_transaccion_x_fac": datag.numero_transaccion_x_fac,
            "detalle_transaccion_por_fac": datag.detalle_transaccion_por_fac,
            "tipo_documento": datag.tipo_documento,
            "referencia_factura": datag.referencia_factura,
            "codigo_sucursal_vh26": datag.codigo_sucursal_vh26,
            "codigo_agencia_vh26": datag.codigo_agencia_vh26,
            "anio_vh26": datag.anio_vh26,
            "numero_factura_vh26": datag.numero_factura_vh26,
            "secuencia_detalle_vh03": datag.secuencia_detalle_vh03,
            "tipo_documento_vh26": datag.tipo_documento_vh26,
            "referencia_vh26": datag.referencia_vh26,
            "bodega_acc_costo": datag.bodega_acc_costo,
            "numero_transaccion_acc_costo": datag.numero_transaccion_acc_costo,
            "detalle_transaccion_acc_costo": datag.detalle_transaccion_acc_costo,
            "costo_unitario": datag.costo_unitario,
            "costo_componente": datag.costo_componente,
            "fecha_creacion": datag.fecha_creacion,
            "hora_creacion": datag.hora_creacion,
            "usuario_creacion": datag.usuario_creacion,
            "prog_creacion": datag.prog_creacion,
            "fecha_modificacion": datag.fecha_modificacion,
            "hora_modificacion": datag.hora_modificacion,
            "usuario_modificacion": datag.usuario_modificacion,
            "prog_modificacion": datag.prog_modificacion,
            "tercero_factura_a": datag.tercero_factura_a,
            "tipo_registro": datag.tipo_registro,
            "estado_posteo": datag.estado_posteo,
            "observacion_posteo": datag.observacion_posteo,
            "nombre_color": datag.nombre_color,
            "nombre_marca": datag.nombre_marca,
            "nombre_modelo": datag.nombre_modelo,
            "nombre_item": datag.nombre_item,
            "nombre_kit": datag.nombre_kit,
            "CONTROL_alistamiento": datag.CONTROL_alistamiento+"."+cllave
        };
        var reslutado_final = "";
        var spres = "";
        $.ajax({
            url: urlGuardar,
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
                        reslutado_final = "1-Se actualiz\u00F3 la infomaci&oacute;n."
                    } else {
                        spres = "5";
                        reslutado_final = datas.substr(0, datas.length - 2);

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
        
        valres = reslutado_final
        return valres;

    } catch (f) {
        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error al ingresar la infomaci&oacute;n.");
        return valres;
    }

}
