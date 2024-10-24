<template>
  <v-container id="data-tables" tag="section">
    <base-material-card
      icon="mdi-account-group"
      color="greenlight"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          Inventario
          <h3 style="font-size: 12px;">
            Última actualización:
            {{ lastUpdated ? lastUpdated : "No disponible" }}
          </h3>
        </div>
      </template>
      <v-text-field
        v-model.trim="search"
        append-icon="mdi-magnify"
        append-icon-aria-label="Buscar en inventario"
        label="Buscar"
        hide-details
        single-line
        style="max-width: 250px"
        @input="debounceSearch"
        @keyup.enter="searchInventory"

      />

      <v-divider class="mt-3" />
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="10" 
        :sort-by="['name']"
        :sort-desc="[false, true]"
        class="elevation-1 tableDesktop"
        :loading="loading"
      >
        <template v-slot:item.cant="{ item }">
          {{ formatNumber(item.cant) }}
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
import i18n from "@/i18n";
import { searchnameInventory, inventoryGetList } from "../../../api/modules/inventory";
import _ from "lodash"; // Asegúrate de tener lodash instalado

export default {
  name: "DashboardDataTables",
  data: () => ({
    loading: false, // Indicador de carga
    snackbar: false,
    message: "",
    id: null,
    headers: [
      { text: "Código", value: "codigo" },
      { text: "Nombre", value: "name" },
      { text: "Precio $", value: "priceD" },
      { text: "Costo $", value: "cost" },
      { text: "Existencia", value: "cant" },
      { text: "Sucursal", value: "sucursal" }
    ],
    items: [],
    search: "",
    lastUpdated: ""
  }),

  mounted() {
    this.fetchData();
    this.searchInventory();
  },
  
  watch: {
    search(newValue) {
      if (newValue === "") {
        this.fetchData();
      }
    }
  },

  methods: {
    // Formato de números
    formatNumber(value) {
      if (!value) return "0";
      return new Intl.NumberFormat("de-DE").format(value);
    },

    // Debounce para búsqueda
    debounceSearch: _.debounce(function() {
      this.searchInventory();
    }, 4000), // 300 ms de retardo

    // Cargar datos de inventario con caché
    async fetchData() {
      this.loading = true;
      const cachedData = sessionStorage.getItem("inventoryData");
      const cachedUpdateTime = sessionStorage.getItem("lastUpdated");

      if (cachedData && cachedUpdateTime) {
        this.items = JSON.parse(cachedData);
        this.lastUpdated = cachedUpdateTime;
        this.loading = false;
      } else {
        try {
          const result = await inventoryGetList();
          if (result.status === 200) {
            this.items = result.data;
            if (this.items.length > 0) {
              const mostRecentItem = this.items.reduce((prev, current) =>
                new Date(prev.updatedAt) > new Date(current.updatedAt) ? prev : current
              );
              const options = { timeZone: "America/Caracas", hour12: false };
              this.lastUpdated = new Date(mostRecentItem.updatedAt).toLocaleString("es-VE", options);
              sessionStorage.setItem("inventoryData", JSON.stringify(this.items));
              sessionStorage.setItem("lastUpdated", this.lastUpdated);
            }
          } else {
            this.message = result.message.text;
          }
        } catch (error) {
          console.error("Error fetching inventory:", error);
        } finally {
          this.loading = false;
        }
      }
    },

    // Búsqueda en inventario
    async searchInventory() {
      this.loading = true;
      try {
        const keywords = this.search.trim();
        const result = await searchnameInventory(keywords);
        this.items = result;
      } catch (error) {
        console.error("Error en searchInventory:", error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para pantallas móviles */
</style>
