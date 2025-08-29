document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const bodegaSel = document.getElementById('bodega');
    const sucursalSel = document.getElementById('sucursal');
    const monedaSel = document.getElementById('moneda');
    const materialesCheckbox = document.querySelectorAll('input[name="material"]');

    const valor_por_defecto = (selectElement, defaultText) => {
        selectElement.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = defaultText;
        selectElement.appendChild(defaultOption);
    };
    
    async function cargar_datos() {
        try {
            const response = await fetch('guardar_producto.php?action=cargar_opciones');
            const data = await response.json();

            valor_por_defecto(bodegaSel, '-');
            data.bodegas.forEach(bodega =>{
                const option = document.createElement('option');
                option.value = bodega.id_bodega;
                option.textContent = bodega.nombre;
                bodegaSel.appendChild(option);
            });

            valor_por_defecto(monedaSel, '-');
            data.monedas.forEach(moneda =>{
                const option = document.createElement('option');
                option.value = moneda.id_moneda;
                option.textContent = moneda.nombre;
                monedaSel.appendChild(option);
            });

        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            alert('Error al cargar datos iniciales.');
        }
    }

    bodegaSel.addEventListener('change', async () => {
        const bodega_id = bodegaSel.value;

        valor_por_defecto(sucursalSel, '-');
        sucursalSel.disabled = true;
        if (bodega_id) {
            try {
                const response = await fetch(`guardar_producto.php?action=cargar_sucursales&bodega_id=${bodega_id}`);
                const data = await response.json();
                
                data.forEach(sucursal =>{
                    const option = document.createElement('option');
                    option.value = sucursal.id_sucursal;
                    option.textContent = sucursal.nombre;
                    sucursalSel.appendChild(option);
                }
                );
                sucursalSel.disabled = false;
            } catch (error) {
                console.error('Error al cargar sucursales:', error);
                alert('Error al cargar sucursales.');
            }
        }
        

    });

    async function validar_formulario() {
        const regexCodigo = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
        const regexPrecio = /^\d+(\.\d{1,2})?$/;
        const codigo = document.getElementById('codigo').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const precio = document.getElementById('precio').value.trim();
        const bodega = bodegaSel.value;
        const sucursal = sucursalSel.value;
        const moneda = monedaSel.value;
        const descripcion = document.getElementById('descripcion').value.trim();
        const materiales = [...materialesCheckbox].filter(cb => cb.checked).length;
        

        if (codigo === '') {
            alert('El código del producto no puede estar en blanco.');
            return false;
        }

        if (codigo.length < 5 || codigo.length > 15) {
            alert('El código del producto debe tener entre 5 y 15 caracteres.');
            return false;
        }

        if (!regexCodigo.test(codigo)) {
            alert('El código del producto debe contener letras y números.');
            return false;
        }

        if (nombre === '') {
            alert('El nombre del producto no puede estar en blanco.');
            return false;
        }

        if (nombre.length < 2 || nombre.length > 50) {
            alert('El nombre del producto debe tener entre 2 y 50 caracteres.');
            return false;
        }

        if (bodega === '') {
            alert('Debe seleccionar una bodega.');
            return false;
        }

        if (sucursal === '') {
            alert('Debe seleccionar una sucursal.');
            return false;
        }

        if (moneda === '') {
            alert('Debe seleccionar una moneda para el producto.');
            return false;
        }

        if (precio === '') {
            alert('El precio del producto no puede estar en blanco.');
            return false;
        }

        if (!regexPrecio.test(precio)) {
            alert('El precio del producto debe ser un número positivo con hasta dos decimales.');
            return false;
        }

        if (materiales < 2){
            alert('Debe seleccionar al menos dos materiales para el producto.');
            return false;
        }

        if(descripcion === ''){
            alert('La descripción del producto no puede estar en blanco.');
            return false;
        }

        if(descripcion.length < 10  || descripcion.length > 1000){
            alert('La descripción del producto debe tener entre 10 y 1000 caracteres.');
            return false;
        }

        return true;
    }

    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (await validar_formulario()) {
            const materialesSeleccionados = [...materialesCheckbox].filter(cb => cb.checked).map(cb => cb.value);

            const datos = {
                codigo: document.getElementById('codigo').value.trim(),
                nombre: document.getElementById('nombre').value.trim(),
                bodega: bodegaSel.value,
                sucursal: sucursalSel.value,
                moneda: monedaSel.value,
                precio: document.getElementById('precio').value.trim(),
                descripcion: document.getElementById('descripcion').value.trim(),
                materiales: materialesSeleccionados
            };

            try {
                const response = await fetch('guardar_producto.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });

                const result = await response.json();
                if (result.success) {
                    alert(result.message);
                    formulario.reset(); 
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error al guardar:', error);
                alert('No se pudo guardar el producto.');
            }
        }
    });

    

    cargar_datos();
    
});
