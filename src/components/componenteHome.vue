<script>

export default{
    data: function(){
        return{
            busqueda : " ",
            token: localStorage.getItem('Token')
        };
    }
};

</script>


<template>
 
    <div>
        <h1>Plantilla Examen</h1>
        <h3>Descripción de la página</h3>
    </div>

    <div class="buscar">
        <input v-model="busqueda" placeholder="Busca" />
    </div>

    <table class="tabla-Inicio">    
        <tr v-if="token">
            <td class="text-button"><router-link to="/crearSinFoto" ><a class="boton_personalizado" href="">Crear anuncio</a></router-link></td>
            <td class="text-cell">Describir la creacion de un anuncio</td>
        </tr>
    </table>

</template>

<style setup>
@import '../assets/componenteHomeStyle.css';
</style>