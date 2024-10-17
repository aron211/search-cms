<template>
  <v-container
    class="error-page fill-height"
    tag="section"
  >
    <v-row
      class="text-center"
      justify="center"
    >
      <v-col cols="auto">
        <h1 class="title font-weight-black">
          Acceso Denegado
        </h1>
        <img
          src=""
          alt=""
        >

        <div class="display-3 mb-5 mt-10">
          No tienes permiso para ingresar a esta ruta :(
        </div>

        <v-btn
          depressed
          @click="$router.go(-1)"
        >
          Salir de aquí!
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'PagesError',
  }
</script>

<style lang="sass">
.error-page
  h1
    font-size: 1rem
</style>
