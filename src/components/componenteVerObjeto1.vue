<script>

import axios from 'axios';
import { GoogleMap, Marker } from 'vue3-google-map';

export default {
  name: "get-request",
  components: {
    GoogleMap,
    Marker
  },
  data() {
    return {
      vivienda: null,
      fechaInicio: null,
      fechaFin: null,
      huespedes: null,
      reservas: null,
      disponibles: true,
      pagoPendiente: false,
      loaded: false,
      paidFor: false,
      price: null,
      reservaObjeto: {},
      token: null,
      nombreUsuario: ""
    };
  },
  created() {
    this.token = localStorage.getItem('Token');
    if(this.token != null){
      let nombre = localStorage.getItem('NombreUsuario');
      console.log(nombre)
      let indice = nombre.indexOf("@");
      // Cortar desde 0 hasta la aparición del @
      this.nombreUsuario = nombre.substring(0, indice);
    }
    var parametro = this.$route.params.id;
    axios.get("https://wqi17i.deta.dev/appObjeto1/objeto1", { params: { id: parametro } }).then(response => this.vivienda = response.data);
    //axios.get("https://2kl0wm.deta.dev/appReservas/reservas/viviendasAsociada/" + parametro).then(res => this.reservas = res.data);
  },

  methods: {
    /*comentar() {

      var comentarioVivienda = {
        "texto": this.comentario,
        "usuario": this.nombreUsuario
      }

      this.vivienda.comentarios.unshift(comentarioVivienda);

      axios({
        method: 'put',
        url: 'http://localhost:8001/viviendas/' + this.vivienda._id,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(this.vivienda)
      })

      this.comentario = "";
      alert("Se ha realizado el comentario correctamente");
    },*/
    mapCenter() {
      return {
        lat: parseFloat(this.vivienda.latitud),
        lng: parseFloat(this.vivienda.longitud),
      }
    },
    /*
    comprobarDias(dia) {
      var size = Object.keys(this.reservas).length;
      var cont = 0;
      var disponible = true;
      while (cont < size && disponible) {
        //Comparar el dia concreto de abajo con todo el intervalo de las reservas
        disponible = dia < Date.parse(this.reservas[cont].fechaInicio) || dia > Date.parse(this.reservas[cont].fechaFin);
        cont++;
      }
      return disponible;
    },
    disponibilidad() {
      var cont = this.calcularIntervalo() + 1;
      var disponible = Date.parse(this.fechaFin) > Date.parse(this.fechaInicio);
      var dia = Date.parse(this.fechaInicio);

      while (cont > 0 && disponible) {
        //Dia a dia del intervalo
        disponible = this.comprobarDias(dia);
        cont--;
        dia = dia + (1000 * 60 * 60 * 24); //sumamos un dia 
      }
      return disponible;
    },
    calcularIntervalo() {
      let resta = Date.parse(this.fechaFin) - Date.parse(this.fechaInicio);
      return Math.round(resta / (1000 * 60 * 60 * 24));
    },
    funcionPago() {
      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=ASfKR507JdZYCMd1Af0amkoNTv7YWS3vP1WrdUtAjd5is4sfPJ6P9_TjG5Ib5DqROqD7qlgzWm2vTIAC";
      script.addEventListener("load", this.setLoaded);
      document.body.appendChild(script);
    },
    realizarPago() {
      this.funcionPago();
      this.price = this.reservaObjeto.costeTotal;
      this.pagoPendiente = true;
    },
    async sendForm() {

      var objeto = {};

      objeto = {
        "id": this.vivienda._id,
        "direccion": this.vivienda.direccion,
        "localidad": this.vivienda.localidad,
        "provincia": this.vivienda.provincia,
        "foto": this.vivienda.foto
      };

      this.reservaObjeto = {
        "vivienda": objeto,
        "fechaInicio": this.fechaInicio,
        "fechaFin": this.fechaFin,
        "costeTotal": this.vivienda.precio * this.calcularIntervalo(),
        "usernameBuyer": this.nombreUsuario
      }

      if (!this.disponibilidad()) {
        alert('No se puede reservar. Las fechas no son válidas.');
      } else if (this.huespedes > this.vivienda.capacidad) {
        alert('No se puede reservar. Demasiados huéspedes.');
      } else {
        this.realizarPago();
      }
    },
    setLoaded: function () { //paypal
      this.loaded = true;
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: this.price
                  }
                }
              ]
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            this.paidFor = true;
            axios.post("https://2kl0wm.deta.dev/appReservas/reservas", this.reservaObjeto).then((result) => { console.log(result.data); });
            axios.get("https://2kl0wm.deta.dev/appReservas/reservas/viviendasAsociada/" + this.vivienda._id).then(res => this.reservas = res.data);
            console.log(order);
          },
          onError: err => {
            console.log(err);
          }
        })
        .render(this.$refs.paypal);
    }*/
  }
}

</script>

<template>

  <div>
    <table class="tabla-Grande" v-if="vivienda">
      <tr>

        <td class="celda-Anuncio"><img :src='vivienda.foto' width="375" /></td>

        <td class="celda-Anuncio">

          <table class="tabla-Info">
            <tr>
              <td class="bold-text">Direccion:&nbsp;</td>
              <td>{{ vivienda.direccion }}</td>
            </tr>

            <tr>
              <td class="bold-text">Localidad:&nbsp;</td>
              <td>{{ vivienda.localidad }}</td>
            </tr>

            <tr>
              <td class="bold-text">Provincia:&nbsp;</td>
              <td>{{ vivienda.provincia }}</td>
            </tr>

            <tr>
              <td class="bold-text">Características:&nbsp;</td>
              <td>{{ vivienda.caracteristicas }}</td>
            </tr>

            <tr>
              <td class="bold-text">Capacidad:&nbsp;</td>
              <td>{{ vivienda.capacidad }}</td>
            </tr>

            <tr>
              <td class="bold-text">Precio/día:&nbsp;</td>
              <td>{{ vivienda.precio }}</td>
            </tr>

            <tr>
              <td class="bold-text">Vendedor:&nbsp;</td>
              <td>{{ vivienda.vendedor }}</td>
            </tr>

          </table>

        </td>

      </tr>
    </table>

    <div class="mapa" v-if="vivienda">
      <GoogleMap api-key="AIzaSyAVotfCRyxA9y3yBiOafDlwoessHlHleJk"
        style="width: 400px; height: 400px; align: center; padding-left: 25%; padding-right: 25%;"
        :center="this.mapCenter()" :zoom="16">
        <Marker :options="{ position: this.mapCenter() }" />
      </GoogleMap>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/mostrarInformacionStyle.css';
</style>

