<script>

import axios from 'axios';

/* eslint-disable no-undef */
import {computed, ref} from 'vue'
import {useGeolocation} from './useGeolocation'
import {Loader} from '@googlemaps/js-api-loader'
//Poner su propia API KEY de Google
const GOOGLE_MAPS_API_KEY = 'AIzaSyAVotfCRyxA9y3yBiOafDlwoessHlHleJk'
export default {
    name: 'GPS4',
    methods: {
        sendForm(dir, lat, lng){
            let nombreCorreo = this.token.email;
            let indice = nombreCorreo.indexOf("@");
            // Cortar desde 0 hasta la aparición del @
            let nombreSinCorreo = nombreCorreo.substring(0, indice);
            
            var objeto = {};

            objeto = { 
                "direccion"    : dir,
                "capacidad"  : this.capacidad,
                "caracteristicas" : this.caracteristicas,
                "localidad" :  this.localidad ,
                "provincia" : this.provincia, 
                "foto" : this.foto,
                "precio" : this.precio,
                "latitud" : lat.toString(),
                "longitud" : lng.toString(),
                "vendedor" : nombreSinCorreo
            };

            axios.post("https://wqi17i.deta.dev/appObjeto1/objetos1", objeto).then((result) => {
            this.id = result.data;
            });

            alert('La vivienda ha sido creada correctamente');
        },
        handleFileChange: function(event) {
            console.log("handlefilechange", event.target.files);
            this.file = event.target.files[0];
            this.filesSelected = event.target.files.length;
        },

        prepareFormData: function() {
            this.formData = new FormData();
            this.formData.append("upload_preset", this.preset);
            this.formData.append("file", this.fileContents);
        },

        upload: function (dir,lat,lng) {
            let reader = new FileReader();
            // attach listener to be called when data from file
            reader.addEventListener(
                "load",
                function () {
                    this.fileContents = reader.result;
                    this.prepareFormData();
                    let cloudinaryUploadURL = `https://api.cloudinary.com/v1_1/dyfjvgtmq/image/upload`;
                    
                    let requestObj = {
                        url: cloudinaryUploadURL,
                        method: "POST",
                        data: this.formData,
                    };
                    axios(requestObj)
                        .then(response => {
                            this.results = response.data;
                            this.foto= this.results.secure_url;
                            this.sendForm(dir,lat,lng);
                        })
                }.bind(this),
                false
            );
            // call for file read if there is a file
            if (this.file && this.file.name) {
                reader.readAsDataURL(this.file);
            }

        },
    },

    //PARA EL MAPA
    setup() {
        const {coords} = useGeolocation()
        const currPos = computed(() => ({
            lat: coords.value.latitude,
            lng: coords.value.longitude
        }))
        
        const loader = new Loader({
            apiKey: GOOGLE_MAPS_API_KEY, libraries: ['places']
        });
        let mapDiv = ref(null)
        let map = ref(null)
        let marker = ref(null)
        let resul_lat = ref(null);
        let resul_lng = ref(null);
        let resul_dir = ref(null);
        
        //initMap
        loader.load().then(() => {
            let center;
            if (sessionStorage.getItem('center')) {
                console.log('session')
                center = JSON.parse(sessionStorage.getItem('center'))
                document.getElementById('place-input').value = sessionStorage.getItem('placeInput')
                resul_lng.value = center.lng;
                resul_lat.value = center.lat;
                
            } else {
                center = currPos.value;
                resul_lng.value = center.lng;
                resul_lat.value = center.lat;
            }

            

            map.value = new google.maps.Map(mapDiv.value, {
                //centrado en posicion actual
                center: center,
                zoom: 18
            })
            marker = new google.maps.Marker({
                map: map.value,
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: center
            })
            google.maps.event.addListener(marker, 'dragend', function () {
                resul_lat.value = marker.getPosition().lat()
                resul_lng.value = marker.getPosition().lng()
                center = {
                    lat: resul_lat.value,
                    lng: resul_lng.value
                }
                //guardar center por arrastre
                sessionStorage.setItem('center', JSON.stringify(center))
            })
            //autocompletar
            const placeInput = document.getElementById("place-input");
            const options = {
                componentRestrictions: {country: "es"},
                types: ['geocode']
            }
            const autocomplete = new google.maps.places.Autocomplete(placeInput, options);
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                //obtener el lugar
                let place = autocomplete.getPlace();
                resul_dir.value = place.formatted_address;
                sessionStorage.setItem('placeInput', placeInput.value)
                center = place.geometry.location;
                //guardar center por busqueda plces
                sessionStorage.setItem('center', JSON.stringify(center))
                //centrar el mapa en el lugar
                map.value.setCenter(center)
                //poner marcador en ese lugar
                marker.setPosition(center)
                sessionStorage.setItem('map', map.value);
                sessionStorage.setItem('marker', marker.value);
                resul_lat.value = center.lat();
                resul_lng.value = center.lng();
                
            });
        })
        return {
            //mapa
            mapDiv,
            //coordenadas
            resul_lat, resul_lng, resul_dir
        }
    },

    data(){
        return{
            caracteristicas : "",
            direccion : this.resul_dir,
            precio : "",
            capacidad : "",
            localidad : "",
            provincia : "",
            foto: "",
            latitud: this.resul_lat,
            longitud: this.resul_lng,
            id : null, 
            file : null,
            filesSelected : 0, 
            fileContents: null, 
            formData : null,
            cloudname: "dyfjvgtmq", 
            preset: "fivlxjqq", 
            token : jwt_decode(localStorage.getItem('Token'))
        }
    }
}
</script>

<template>

<h1>Registrar anuncio</h1>
    <h5>(Los campos marcados con * son obligatorios)</h5>  
        <form @submit.prevent="upload(resul_dir,resul_lat,resul_lng)">
           
            <label for="caracteristicas">Caracteristicas</label><br>
            <input type="text" v-model="caracteristicas" size="50" width="50" /> <br>

            <!-- Autocomplete location search input -->
            <label for="direccion">Direccion*</label><br>
            <input class="w-full" id="place-input" type="text" required />
            <br>

            <label for="direccion">Localidad*</label><br>
            <input type="text" v-model="localidad" required /> <br>

            <label for="direccion">Provincia*</label><br>
            <input type="text" v-model="provincia" required /> <br>

            <label for="precio">Precio/dia*</label><br>
            <input type="number" v-model="precio" required /> <br>

            <label for="capacidad">Capacidad*</label><br>
            <input type="number" v-model="capacidad" required /> <br>

            <br>
            <label for="file-input">Sube foto de la vivienda:</label> <br>
            <input id="file-input" type="file" accept="image/png, image/jpeg" @change="handleFileChange($event)" />
            <br>

            <input type="submit" :disabled="filesSelected < 1 " value="Crear">
        
        </form>

        <div class="m-6" ref="mapDiv" style="width: 40%; height: 400px; margin-left: 470px;"/>
</template>

<style>
    div#mapa{
        margin-top: 100px;
    }
</style>