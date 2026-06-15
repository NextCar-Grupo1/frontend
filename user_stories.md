# User Stories 

Documento de historias de usuario del frontend de NextCar, basado en el enunciado del trabajo final, el informe del primer hito y el modelo relacional de Compra Inteligente.

## User Story ID: US01

**Epic ID:** EP01 - Gestion de acceso y usuarios

**Titulo:** Registro de usuario

**Descripcion:** Como nuevo usuario, quiero registrar mis datos personales, laborales y credenciales para poder acceder a NextCar y realizar simulaciones de credito vehicular por Compra Inteligente.

**Criterios de aceptacion:**
1. El formulario debe solicitar nombres, apellidos, tipo de documento, numero de documento, fecha de nacimiento, correo electronico, telefono, ingreso mensual bruto, tipo de empleo, contrasena y confirmacion de contrasena.
2. El sistema debe validar campos obligatorios antes de enviar el registro.
3. El sistema debe validar formato de correo electronico.
4. El sistema debe validar que el ingreso mensual bruto sea igual o mayor al minimo requerido para Compra Inteligente.
5. El sistema debe validar que la contrasena y la confirmacion coincidan.
6. El usuario debe aceptar terminos, politica de privacidad y autorizacion de consulta crediticia.
7. Tras un registro exitoso, el usuario debe quedar autenticado y ser redirigido al dashboard.
8. El usuario registrado debe quedar preparado para persistirse en el recurso `usuarios`.
9. La operacion debe quedar preparada para generar un registro en `logsOperacion`.

**Escenario 1: Registro exitoso**
- **Given** que el usuario se encuentra en la pantalla de registro,
- **When** completa todos los campos requeridos con datos validos, acepta las condiciones y hace clic en `Registrarme`,
- **Then** el sistema crea la cuenta del usuario,
- **And** inicia sesion automaticamente,
- **And** redirige al usuario al dashboard.

**Escenario 2: Datos obligatorios incompletos**
- **Given** que el usuario se encuentra en la pantalla de registro,
- **When** deja campos obligatorios vacios y hace clic en `Registrarme`,
- **Then** el sistema bloquea el registro,
- **And** marca los campos que requieren correccion.

**Escenario 3: Ingreso mensual menor al minimo**
- **Given** que el usuario esta completando sus datos financieros,
- **When** ingresa un ingreso mensual bruto menor al minimo requerido,
- **Then** el sistema invalida el formulario,
- **And** no permite crear la cuenta hasta corregir el ingreso.

**Escenario 4: Confirmacion de contrasena incorrecta**
- **Given** que el usuario ingreso una contrasena,
- **When** la confirmacion de contrasena no coincide y hace clic en `Registrarme`,
- **Then** el sistema no registra la cuenta,
- **And** muestra un mensaje indicando que las contrasenas no coinciden.

## User Story ID: US02

**Epic ID:** EP01 - Gestion de acceso y usuarios

**Titulo:** Inicio de sesion obligatorio

**Descripcion:** Como usuario registrado, quiero iniciar sesion con correo y contrasena para acceder de forma segura a mis simulaciones y resultados financieros.

**Criterios de aceptacion:**
1. El acceso debe realizarse mediante correo electronico y contrasena.
2. El sistema debe validar las credenciales contra el recurso `usuarios`.
3. Si las credenciales son correctas, debe redirigir al dashboard.
4. Si las credenciales son incorrectas, debe mostrar un mensaje de error.
5. Las rutas internas deben estar protegidas para usuarios no autenticados.
6. El campo de contrasena debe permitir mostrar u ocultar el valor con un icono de ojo.
7. El inicio de sesion exitoso debe quedar preparado para registrar una accion `LOGIN` en `logsOperacion`.

**Escenario 1: Inicio de sesion exitoso**
- **Given** que el usuario se encuentra en la pantalla de inicio de sesion,
- **When** ingresa correo y contrasena correctos y hace clic en `Iniciar sesion`,
- **Then** el sistema valida las credenciales,
- **And** redirige al usuario al dashboard.

**Escenario 2: Credenciales invalidas**
- **Given** que el usuario se encuentra en la pantalla de inicio de sesion,
- **When** ingresa correo o contrasena incorrectos y hace clic en `Iniciar sesion`,
- **Then** el sistema deniega el acceso,
- **And** muestra un mensaje indicando que las credenciales no fueron encontradas.

**Escenario 3: Acceso a ruta protegida sin sesion**
- **Given** que el usuario no ha iniciado sesion,
- **When** intenta acceder directamente a una ruta interna como `/dashboard`,
- **Then** el sistema bloquea el acceso,
- **And** redirige al usuario a `/auth/login`.

**Escenario 4: Visualizacion de contrasena**
- **Given** que el usuario ingreso una contrasena oculta,
- **When** hace clic en el icono de ojo,
- **Then** el sistema muestra temporalmente la contrasena,
- **And** permite volver a ocultarla con el mismo control.

## User Story ID: US03

**Epic ID:** EP02 - Panel principal y navegacion

**Titulo:** Dashboard financiero del usuario

**Descripcion:** Como usuario autenticado, quiero visualizar un dashboard con mis simulaciones guardadas y metricas principales para conocer rapidamente mi estado financiero y continuar mi proceso de Compra Inteligente.

**Criterios de aceptacion:**
1. El dashboard debe mostrar la cantidad de simulaciones guardadas.
2. El dashboard debe mostrar el monto financiado acumulado.
3. El dashboard debe mostrar la probabilidad promedio de aprobacion.
4. Debe mostrar simulaciones recientes con vehiculo, entidad financiera, fecha, cuota mensual, plazo y estado.
5. Debe permitir iniciar una nueva simulacion.
6. Debe permitir acceder a soporte o conceptos clave.
7. Debe mostrar un estado vacio si el usuario no tiene simulaciones.
8. Los datos deben obtenerse desde la fake API mediante servicios de infraestructura.

**Escenario 1: Usuario con simulaciones guardadas**
- **Given** que el usuario tiene simulaciones asociadas a su cuenta,
- **When** ingresa al dashboard,
- **Then** el sistema muestra sus metricas principales,
- **And** lista sus simulaciones recientes.

**Escenario 2: Usuario sin simulaciones**
- **Given** que el usuario no tiene simulaciones registradas,
- **When** ingresa al dashboard,
- **Then** el sistema muestra un estado vacio,
- **And** ofrece una accion para crear una nueva simulacion.

**Escenario 3: Acceso a nueva simulacion**
- **Given** que el usuario se encuentra en el dashboard,
- **When** hace clic en `Nueva simulacion`,
- **Then** el sistema lo dirige al simulador de credito vehicular.

**Escenario 4: Fallo al cargar metricas**
- **Given** que la API no responde correctamente,
- **When** el dashboard intenta cargar simulaciones,
- **Then** la interfaz debe evitar romperse,
- **And** no debe mostrar datos inconsistentes.

## User Story ID: US04

**Epic ID:** EP03 - Simulacion de credito vehicular

**Titulo:** Seleccion de vehiculo

**Descripcion:** Como usuario, quiero seleccionar el vehiculo que deseo financiar para que la simulacion use su precio, moneda y caracteristicas base.

**Criterios de aceptacion:**
1. El sistema debe cargar vehiculos desde el recurso `vehiculos`.
2. Cada vehiculo debe incluir marca, modelo, anio, precio base, moneda, tipo de combustible, estado e imagen.
3. Al seleccionar un vehiculo, el sistema debe precargar precio base y moneda.
4. El usuario debe poder modificar el precio para evaluar escenarios alternativos.
5. La simulacion debe guardar la relacion con el vehiculo mediante `vehicleId`.
6. El sistema no debe permitir calcular si no existe vehiculo seleccionado.

**Escenario 1: Seleccion de vehiculo en soles**
- **Given** que existen vehiculos cargados desde la API,
- **When** el usuario selecciona Toyota Corolla Cross,
- **Then** el sistema precarga su precio base,
- **And** selecciona moneda soles.

**Escenario 2: Seleccion de vehiculo en dolares**
- **Given** que existen vehiculos cargados desde la API,
- **When** el usuario selecciona Honda Civic,
- **Then** el sistema precarga su precio base,
- **And** selecciona moneda dolares.

**Escenario 3: Precio invalido**
- **Given** que el usuario selecciono un vehiculo,
- **When** borra el precio o ingresa un valor menor o igual a cero,
- **Then** el sistema invalida el formulario,
- **And** bloquea el calculo del cronograma.

**Escenario 4: Vehiculos no disponibles**
- **Given** que la API no devuelve vehiculos,
- **When** el usuario intenta iniciar una simulacion,
- **Then** el sistema no puede completar la seleccion,
- **And** no debe permitir guardar una simulacion incompleta.

## User Story ID: US05

**Epic ID:** EP03 - Simulacion de credito vehicular

**Titulo:** Configuracion de condiciones del credito

**Descripcion:** Como usuario, quiero definir cuota inicial, plazo y fecha de inicio para simular un credito vehicular bajo las reglas de Compra Inteligente.

**Criterios de aceptacion:**
1. La cuota inicial debe expresarse como porcentaje del precio del vehiculo.
2. La cuota inicial minima debe ser 20%.
3. El plazo debe permitir 24 o 36 meses.
4. La fecha de inicio debe usarse para generar las fechas de vencimiento del cronograma.
5. El monto financiado debe calcularse como precio del vehiculo menos cuota inicial.
6. Los cambios en cuota inicial deben actualizar el resumen de simulacion.
7. El sistema debe impedir calcular si las condiciones principales son invalidas.

**Escenario 1: Condiciones validas**
- **Given** que el usuario selecciono un vehiculo de S/ 85,000,
- **When** define cuota inicial de 20%, plazo de 36 meses y fecha de inicio valida,
- **Then** el sistema calcula un monto financiado de S/ 68,000,
- **And** habilita el calculo del cronograma.

**Escenario 2: Aumento de cuota inicial**
- **Given** que el usuario esta configurando el credito,
- **When** aumenta la cuota inicial de 20% a 35%,
- **Then** el sistema reduce el monto financiado,
- **And** actualiza la cuota mensual estimada.

**Escenario 3: Cuota inicial menor al minimo**
- **Given** que el usuario esta configurando la cuota inicial,
- **When** intenta ingresar un porcentaje menor a 20%,
- **Then** el sistema invalida el campo,
- **And** no permite calcular la simulacion.

**Escenario 4: Fecha de inicio vacia**
- **Given** que el usuario esta completando condiciones del credito,
- **When** elimina la fecha de inicio,
- **Then** el sistema marca el campo como requerido,
- **And** bloquea el guardado de la simulacion.

## User Story ID: US06

**Epic ID:** EP03 - Simulacion de credito vehicular

**Titulo:** Configuracion de entidad financiera y tasa

**Descripcion:** Como usuario, quiero seleccionar una entidad financiera y configurar la tasa de interes para que el calculo represente las condiciones de la entidad que ofrece el credito.

**Criterios de aceptacion:**
1. El sistema debe cargar entidades financieras desde `entidadesFinancieras`.
2. Cada entidad debe incluir nombre, TEA referencial, tasa de seguro vehicular y tasa de desgravamen.
3. Al seleccionar una entidad, debe precargarse la tasa anual referencial.
4. El usuario debe poder elegir entre tasa efectiva y tasa nominal.
5. Si el usuario elige tasa nominal, debe indicar la capitalizacion.
6. El sistema debe convertir la tasa anual a tasa efectiva mensual.
7. La tasa anual debe ingresarse como porcentaje normal, por ejemplo `12.5` para 12.5%.
8. El sistema debe rechazar tasas iguales o menores a cero.

**Escenario 1: Tasa efectiva precargada**
- **Given** que el usuario se encuentra en la configuracion de tasa,
- **When** selecciona BCP como entidad financiera,
- **Then** el sistema precarga la tasa referencial de la entidad,
- **And** usa esa tasa para el calculo estimado.

**Escenario 2: Conversion de TEA a TEM**
- **Given** que el usuario ingreso TEA de 12.5%,
- **When** el sistema calcula la simulacion,
- **Then** convierte la tasa anual a tasa efectiva mensual,
- **And** calcula intereses mensuales sobre el saldo insoluto.

**Escenario 3: Tasa invalida**
- **Given** que el usuario esta configurando la tasa,
- **When** ingresa 0 o un valor negativo,
- **Then** el sistema invalida el formulario,
- **And** no permite calcular el cronograma.

**Escenario 4: Tasa exagerada por error de entrada**
- **Given** que el usuario confunde el formato de tasa,
- **When** ingresa `1250` en lugar de `12.5`,
- **Then** el resultado puede volverse financieramente inviable,
- **And** el usuario debe poder corregir el valor antes de guardar la simulacion.

## User Story ID: US07

**Epic ID:** EP03 - Simulacion de credito vehicular

**Titulo:** Configuracion de seguros, costos y periodos de gracia

**Descripcion:** Como usuario, quiero configurar seguros, costos adicionales y periodos de gracia para obtener una simulacion mas cercana al costo real del credito vehicular.

**Criterios de aceptacion:**
1. El usuario debe poder ingresar seguro de desgravamen como porcentaje.
2. El usuario debe poder ingresar seguro vehicular mensual como monto.
3. El usuario debe poder ingresar costos adicionales mensuales.
4. El usuario debe poder elegir entre sin gracia, gracia parcial o gracia total.
5. El usuario debe poder indicar meses de gracia.
6. Los seguros y costos adicionales deben sumarse a la cuota mensual total.
7. En gracia parcial, durante el periodo de gracia no debe amortizarse capital.
8. En gracia total, el interes debe capitalizarse durante el periodo de gracia.
9. El sistema debe rechazar valores negativos en seguros o costos.

**Escenario 1: Seguros y costos validos**
- **Given** que el usuario esta configurando costos del credito,
- **When** ingresa seguro vehicular mensual de S/ 150 y costos adicionales de S/ 18,
- **Then** el sistema suma esos importes a cada cuota,
- **And** actualiza el resumen financiero.

**Escenario 2: Gracia parcial**
- **Given** que el usuario selecciona gracia parcial,
- **When** configura 2 meses de gracia,
- **Then** el sistema genera cuotas iniciales sin amortizacion de capital,
- **And** mantiene el saldo insoluto durante esos meses.

**Escenario 3: Valores negativos**
- **Given** que el usuario esta ingresando seguros o costos,
- **When** coloca un valor negativo,
- **Then** el sistema invalida el campo,
- **And** bloquea el calculo de la simulacion.

**Escenario 4: Gracia excesiva**
- **Given** que el usuario configura meses de gracia,
- **When** el valor supera el limite permitido para el plazo,
- **Then** el sistema limita el calculo,
- **And** evita generar un cronograma inconsistente.

## User Story ID: US08

**Epic ID:** EP04 - Calculo financiero

**Titulo:** Calculo del credito por metodo frances

**Descripcion:** Como usuario, quiero calcular mi credito vehicular por el metodo frances vencido ordinario para conocer la cuota mensual y la distribucion de interes y amortizacion.

**Criterios de aceptacion:**
1. El sistema debe calcular el monto financiado.
2. El sistema debe convertir la tasa anual a tasa efectiva mensual.
3. El sistema debe calcular una cuota base mediante el metodo frances.
4. El interes mensual debe calcularse sobre el saldo insoluto.
5. La amortizacion debe calcularse como cuota base menos interes.
6. El saldo final debe actualizarse en cada periodo.
7. El sistema debe generar una cuota por cada mes del plazo.
8. En una simulacion sin gracia, el saldo insoluto debe disminuir en cada cuota.
9. La ultima cuota debe dejar el saldo final en cero o cercano a cero por redondeo.
10. La simulacion calculada debe persistirse en `simulaciones`.

**Escenario 1: Calculo exitoso sin gracia**
- **Given** que el usuario completo todos los datos requeridos,
- **When** hace clic en `Calcular cronograma`,
- **Then** el sistema calcula la cuota mediante metodo frances,
- **And** genera un cronograma con tantas cuotas como meses del plazo.

**Escenario 2: Reduccion progresiva del saldo**
- **Given** que la simulacion no tiene periodo de gracia,
- **When** el usuario revisa el cronograma,
- **Then** el saldo insoluto disminuye en cada cuota,
- **And** la amortizacion aumenta progresivamente.

**Escenario 3: Formulario invalido**
- **Given** que faltan campos requeridos o existen valores invalidos,
- **When** el usuario intenta calcular,
- **Then** el sistema no genera cronograma,
- **And** solicita corregir los datos.

**Escenario 4: Error al guardar simulacion**
- **Given** que el calculo financiero se realizo correctamente,
- **When** la API falla al guardar la simulacion,
- **Then** el sistema muestra un mensaje de error,
- **And** no redirige a resultados con datos incompletos.

## User Story ID: US09

**Epic ID:** EP04 - Calculo financiero

**Titulo:** Calculo y visualizacion de VAN, TIR y TCEA

**Descripcion:** Como usuario, quiero visualizar VAN, TIR y TCEA de mi simulacion para evaluar el costo financiero real y comparar alternativas.

**Criterios de aceptacion:**
1. El sistema debe calcular VAN usando los flujos de caja de la simulacion.
2. El sistema debe calcular TIR solo cuando los flujos permitan encontrar una tasa valida.
3. El sistema no debe mostrar TIR infinitas o absurdamente altas por errores numericos.
4. La TCEA debe representar el costo anual estimado considerando tasa, seguros y costos recurrentes.
5. Los indicadores deben mostrarse como porcentajes legibles.
6. Los valores deben actualizarse al cambiar variables de entrada.
7. El usuario debe poder comparar indicadores entre distintas simulaciones.

**Escenario 1: Indicadores razonables**
- **Given** que el usuario ingresa una TEA de 12.5%, cuota inicial de 20%, plazo de 36 meses y costos razonables,
- **When** calcula la simulacion,
- **Then** el sistema muestra TIR y TCEA en un rango financiero razonable,
- **And** evita porcentajes desproporcionados.

**Escenario 2: Comparacion de entidades**
- **Given** que el usuario genero dos simulaciones con bancos distintos,
- **When** revisa los resultados de ambas,
- **Then** puede comparar TIR, VAN y TCEA,
- **And** identificar la alternativa mas conveniente.

**Escenario 3: Flujos no validos para TIR**
- **Given** que los flujos de caja no permiten calcular una TIR valida,
- **When** el sistema procesa los indicadores,
- **Then** no debe mostrar un porcentaje infinito,
- **And** debe evitar presentar informacion financiera enganosa.

**Escenario 4: Datos extremos**
- **Given** que el usuario ingreso tasa, seguros o costos excesivos,
- **When** calcula la simulacion,
- **Then** el sistema puede mostrar una alternativa no conveniente,
- **And** el usuario debe poder volver al simulador para corregir los datos.

## User Story ID: US10

**Epic ID:** EP05 - Resultados y cronograma

**Titulo:** Visualizacion de resultados principales

**Descripcion:** Como usuario, quiero ver los resultados principales de mi simulacion para comprender rapidamente cuota, monto financiado, aprobacion preliminar e indicadores financieros.

**Criterios de aceptacion:**
1. La vista de resultados debe mostrar cuota mensual total.
2. Debe mostrar monto financiado.
3. Debe mostrar probabilidad preliminar de aprobacion.
4. Debe mostrar VAN.
5. Debe mostrar TIR.
6. Debe mostrar TCEA estimada.
7. Debe mostrar el estado de la simulacion.
8. Debe permitir crear una nueva simulacion.
9. Debe permitir exportar o imprimir resultados.

**Escenario 1: Resultados cargados correctamente**
- **Given** que el usuario creo una simulacion valida,
- **When** el sistema redirige a la pantalla de resultados,
- **Then** muestra cuota, monto financiado, aprobacion, VAN, TIR y TCEA,
- **And** conserva la moneda seleccionada.

**Escenario 2: Nueva simulacion desde resultados**
- **Given** que el usuario se encuentra revisando resultados,
- **When** hace clic en `Nueva simulacion`,
- **Then** el sistema lo dirige al simulador,
- **And** permite generar un nuevo escenario.

**Escenario 3: Resultado inexistente**
- **Given** que el usuario intenta abrir una URL con un ID de simulacion inexistente,
- **When** la API no devuelve datos,
- **Then** la pantalla no debe romperse,
- **And** no debe mostrar informacion falsa.

**Escenario 4: Exportacion cancelada**
- **Given** que el usuario presiona `Exportar PDF`,
- **When** cancela la impresion desde el navegador,
- **Then** el sistema permanece en la pantalla de resultados,
- **And** no altera la simulacion guardada.

## User Story ID: US11

**Epic ID:** EP05 - Resultados y cronograma

**Titulo:** Cronograma de pagos detallado

**Descripcion:** Como usuario, quiero revisar el cronograma completo de pagos para conocer fechas, capital vivo, amortizacion, interes, seguros, cuota total y saldo final.

**Criterios de aceptacion:**
1. El cronograma debe mostrar numero de cuota.
2. Debe mostrar fecha de vencimiento.
3. Debe mostrar capital vivo o saldo inicial.
4. Debe mostrar amortizacion.
5. Debe mostrar interes.
6. Debe mostrar seguros.
7. Debe mostrar cuota total.
8. Debe mostrar saldo final.
9. La tabla debe respetar la moneda seleccionada.
10. La tabla debe permitir desplazamiento horizontal en pantallas pequenas.

**Escenario 1: Revision de primera cuota**
- **Given** que el usuario abrio una simulacion sin gracia,
- **When** revisa la primera cuota,
- **Then** observa interes calculado sobre el saldo inicial,
- **And** ve la amortizacion correspondiente.

**Escenario 2: Revision de ultima cuota**
- **Given** que el usuario revisa el final del cronograma,
- **When** observa la ultima cuota,
- **Then** el saldo final debe llegar a cero o a un valor minimo por redondeo,
- **And** el credito queda completamente amortizado.

**Escenario 3: Cronograma en celular**
- **Given** que el usuario abre el cronograma en una pantalla pequena,
- **When** la tabla excede el ancho disponible,
- **Then** el sistema permite desplazamiento horizontal,
- **And** conserva la legibilidad de las columnas.

**Escenario 4: Cronograma inexistente**
- **Given** que una simulacion no contiene cuotas,
- **When** el usuario intenta revisar el cronograma,
- **Then** la interfaz no debe romperse,
- **And** debe evitar mostrar una tabla inconsistente.

## User Story ID: US12

**Epic ID:** EP06 - Gestion de simulaciones

**Titulo:** Consulta de simulaciones guardadas

**Descripcion:** Como usuario, quiero consultar mis creditos simulados para comparar escenarios financieros antes de tomar una decision.

**Criterios de aceptacion:**
1. La pantalla debe listar las simulaciones asociadas al usuario autenticado.
2. Cada simulacion debe mostrar vehiculo, entidad financiera, fecha, estado, cuota, monto financiado y TIR.
3. El usuario debe poder abrir el detalle de una simulacion.
4. El usuario debe poder iniciar una nueva simulacion desde esta seccion.
5. Si no existen simulaciones, debe mostrarse un estado vacio.
6. La informacion debe obtenerse desde el recurso `simulaciones`.

**Escenario 1: Consulta exitosa**
- **Given** que el usuario tiene simulaciones guardadas,
- **When** ingresa a `Mis creditos`,
- **Then** el sistema lista sus simulaciones,
- **And** permite abrir el detalle de cada una.

**Escenario 2: Comparacion de escenarios**
- **Given** que el usuario tiene simulaciones con distintos bancos o plazos,
- **When** revisa la lista,
- **Then** puede comparar cuotas, monto financiado y TIR,
- **And** decidir que simulacion revisar en detalle.

**Escenario 3: Usuario sin simulaciones**
- **Given** que el usuario no tiene simulaciones guardadas,
- **When** entra a `Mis creditos`,
- **Then** el sistema muestra un estado vacio,
- **And** ofrece crear una nueva simulacion.

**Escenario 4: API sin respuesta**
- **Given** que el recurso de simulaciones no responde,
- **When** el usuario entra a la seccion,
- **Then** la interfaz debe evitar errores visuales graves,
- **And** no debe mostrar datos de otro usuario.

## User Story ID: US14

**Epic ID:** EP08 - Soporte y transparencia

**Titulo:** Consulta de soporte y glosario financiero

**Descripcion:** Como usuario, quiero consultar conceptos financieros y canales de ayuda para entender Compra Inteligente, tasas, metodo frances, VAN, TIR y transparencia financiera.

**Criterios de aceptacion:**
1. La pantalla debe explicar Compra Inteligente.
2. Debe explicar TEA y TEM.
3. Debe explicar el metodo frances.
4. Debe explicar VAN y TIR.
5. Debe incluir informacion relacionada con transparencia financiera.
6. Debe mostrar canales simulados de asistencia.
7. Debe ser accesible desde la navegacion principal.

**Escenario 1: Consulta de concepto financiero**
- **Given** que el usuario no entiende un indicador,
- **When** entra a la pantalla de soporte,
- **Then** encuentra definiciones de VAN, TIR, TEA, TEM y metodo frances,
- **And** puede interpretar mejor sus resultados.

**Escenario 2: Consulta de transparencia**
- **Given** que el usuario desea conocer el sustento informativo del credito,
- **When** revisa la seccion de transparencia,
- **Then** el sistema muestra explicaciones sobre costos, tasas y cronograma,
- **And** ayuda a tomar una decision informada.

**Escenario 3: Uso desde mobile**
- **Given** que el usuario abre soporte desde celular,
- **When** navega por los conceptos,
- **Then** la informacion se adapta a una columna,
- **And** evita superposiciones.

**Escenario 4: Asistencia real no disponible**
- **Given** que la version actual es frontend con fake API,
- **When** el usuario intenta usar canales de asistencia,
- **Then** el sistema solo muestra canales simulados,
- **And** no promete una atencion real desde backend.

## User Story ID: US15

**Epic ID:** EP09 - Trazabilidad y auditoria

**Titulo:** Registro de operaciones

**Descripcion:** Como entidad que ofrece el servicio, quiero que las operaciones relevantes del usuario queden preparadas para registrarse y auditar el uso de la aplicacion.

**Criterios de aceptacion:**
1. El registro de usuario debe poder generar log de operacion.
2. El inicio de sesion debe poder generar log de operacion.
3. La creacion de simulaciones debe poder generar log de operacion.
4. El cierre de sesion debe poder generar log de operacion.
5. Cada log debe incluir usuario, accion, detalle y fecha/hora.
6. Los logs deben representarse en el recurso `logsOperacion`.
7. El fallo del log no debe bloquear necesariamente la operacion principal del usuario.

**Escenario 1: Log de inicio de sesion**
- **Given** que el usuario ingresa credenciales validas,
- **When** el sistema autentica la sesion,
- **Then** prepara un registro de accion `LOGIN`,
- **And** lo asocia al usuario autenticado.

**Escenario 2: Log de simulacion creada**
- **Given** que el usuario calcula una simulacion valida,
- **When** la simulacion se guarda correctamente,
- **Then** el sistema prepara un log `CREATE_SIMULATION`,
- **And** almacena el identificador de la simulacion en el detalle.

**Escenario 3: Fallo al registrar log**
- **Given** que la operacion principal fue exitosa,
- **When** la API de logs no responde,
- **Then** el sistema no debe romper el flujo principal,
- **And** debe permitir que el usuario continue.

**Escenario 4: Usuario no autenticado**
- **Given** que no existe usuario autenticado,
- **When** se intenta registrar una accion,
- **Then** el sistema no debe crear logs asociados a un usuario inexistente.

## User Story ID: US16

**Epic ID:** EP10 - Experiencia responsive y navegacion

**Titulo:** Navegacion responsive con toolbar y menu hamburguesa

**Descripcion:** Como usuario, quiero usar la aplicacion desde computadora, tablet o celular para simular y revisar mi credito vehicular de forma comoda.

**Criterios de aceptacion:**
1. La aplicacion debe tener toolbar visible.
2. La navegacion debe mostrar iconos y nombres de seccion.
3. En escritorio debe mostrarse navegacion lateral.
4. En pantallas pequenas debe mostrarse boton hamburguesa.
5. El menu hamburguesa debe abrir y cerrar la navegacion.
6. Las vistas deben adaptarse a una columna en mobile.
7. Las tablas amplias deben permitir desplazamiento horizontal.
8. Los textos no deben superponerse ni salirse de sus contenedores.
9. El footer debe mantenerse disponible en las vistas internas.

**Escenario 1: Navegacion en escritorio**
- **Given** que el usuario abre la app desde una pantalla amplia,
- **When** navega entre secciones,
- **Then** usa la barra lateral con iconos y nombres,
- **And** accede a dashboard, simulador, creditos, perfil y soporte.

**Escenario 2: Navegacion en celular**
- **Given** que el usuario abre la app desde celular,
- **When** presiona el boton hamburguesa,
- **Then** se abre el menu lateral,
- **And** puede seleccionar una seccion.

**Escenario 3: Tabla amplia en mobile**
- **Given** que el usuario revisa el cronograma en celular,
- **When** la tabla excede el ancho disponible,
- **Then** el sistema permite desplazamiento horizontal,
- **And** conserva la informacion legible.

**Escenario 4: Texto largo**
- **Given** que una entidad financiera o descripcion tiene texto largo,
- **When** se muestra en una pantalla pequena,
- **Then** el contenido debe ajustarse,
- **And** no debe romper el layout.

## User Story ID: US17

**Epic ID:** EP11 - Arquitectura e integracion backend

**Titulo:** Frontend preparado para integracion con backend

**Descripcion:** Como equipo de desarrollo, queremos que el frontend este organizado por bounded contexts y consuma una fake API para que el backend pueda reemplazarla sin rehacer la interfaz.

**Criterios de aceptacion:**
1. El proyecto debe estar organizado por bounded contexts.
2. Cada bounded context debe separar `domain`, `application`, `infrastructure` y `presentation` cuando corresponda.
3. El contexto `shared` debe contener elementos reutilizables.
4. Los componentes no deben construir URLs de API directamente.
5. Las URLs y endpoints deben configurarse mediante environments.
6. La fake API debe incluir usuarios, vehiculos, entidades financieras, simulaciones, conceptos de gasto y logs.
7. El frontend debe poder ejecutarse con `json-server`.
8. El backend real debe poder reemplazar `json-server` manteniendo contratos equivalentes.

**Escenario 1: Uso con fake API**
- **Given** que el equipo frontend aun no cuenta con backend real,
- **When** ejecuta `json-server`,
- **Then** la aplicacion consume datos desde `db.json`,
- **And** permite probar los flujos principales.

**Escenario 2: Cambio a API real**
- **Given** que el backend real esta disponible,
- **When** se actualiza la URL base en `environment.ts`,
- **Then** el frontend debe consumir la nueva API,
- **And** las pantallas no deben requerir cambios estructurales.

**Escenario 3: Endpoint renombrado**
- **Given** que backend cambia una ruta de recurso,
- **When** el equipo actualiza el environment o servicio de infraestructura,
- **Then** el cambio queda centralizado,
- **And** no se modifican todas las vistas.

**Escenario 4: Respuesta incompleta del backend**
- **Given** que la API real devuelve datos incompletos,
- **When** el frontend intenta renderizar una vista,
- **Then** debe evitar errores graves de interfaz,
- **And** debe permitir detectar el contrato faltante.

## User Story ID: US18

**Epic ID:** EP05 - Resultados y cronograma

**Titulo:** Exportacion o impresion de resultados

**Descripcion:** Como usuario, quiero exportar o imprimir los resultados de mi simulacion para conservar evidencia del cronograma y comparar alternativas fuera de la aplicacion.

**Criterios de aceptacion:**
1. La pantalla de resultados debe incluir una accion de exportar PDF o imprimir.
2. La accion debe abrir el flujo de impresion del navegador.
3. El reporte debe contener indicadores principales y cronograma.
4. La accion no debe modificar la simulacion guardada.
5. La opcion debe estar disponible solo desde una simulacion cargada.

**Escenario 1: Exportacion exitosa**
- **Given** que el usuario esta en la pantalla de resultados,
- **When** hace clic en `Exportar PDF`,
- **Then** el navegador abre la opcion de impresion,
- **And** el usuario puede guardar el reporte como PDF.

**Escenario 2: Comparacion externa**
- **Given** que el usuario genero dos simulaciones,
- **When** exporta ambas,
- **Then** puede compararlas fuera de la aplicacion,
- **And** tomar una decision informada.

**Escenario 3: Impresion cancelada**
- **Given** que el usuario abrio el flujo de impresion,
- **When** cancela la accion,
- **Then** permanece en la pantalla de resultados,
- **And** la simulacion no se modifica.

**Escenario 4: Simulacion no cargada**
- **Given** que no existe una simulacion cargada,
- **When** el usuario intenta exportar resultados,
- **Then** el sistema no debe fallar,
- **And** no debe generar un reporte vacio.


