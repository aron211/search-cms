<template>
  <v-container>
    <v-row class="mt-5" justify="center">
      <v-col cols="12" md="3">
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startDate"
              label="Fecha desde"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="startDate"
            @input="menu1 = false"
            :max="endDate"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="3">
        <v-menu
          ref="menu2"
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="endDate"
              label="Fecha hasta"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="endDate"
            @input="menu2 = false"
            :min="startDate"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center">
        <v-btn @click="fetchReport" color="primary">
          <v-icon left>mdi-magnify</v-icon> Buscar
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p v-if="reportData">
          Mostrando reporte de: {{ startDate }} a {{ endDate }}
        </p>
        <v-alert v-else type="info"
          >No hay reportes para las fechas seleccionadas.</v-alert
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      startDate: null,
      endDate: null,
      menu1: false,
      menu2: false,
      reportData: null
    };
  },
  methods: {
    fetchReport() {
      if (this.startDate && this.endDate) {
        this.reportData = `Reporte desde ${this.startDate} hasta ${
          this.endDate
        }`;
      }
    },
    clearFilters() {
      this.startDate = null;
      this.endDate = null;
      this.reportData = null;
    }
  }
};
</script>
