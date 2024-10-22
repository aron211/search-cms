<template>
  <v-container id="data-tables" tag="section">
    <base-material-card
      icon="mdi-account-group"
      color="greenligth"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          <!-- {{ $t("users.head") }} -->
          Inventario
          <h3 style="font-size: 12px;">
            ultima actualización:
            {{
              lastUpdated
                ? new Date(lastUpdated).toLocaleString()
                : "No disponible"
            }}
          </h3>
        </div>
      </template>
      <v-text-field
        v-model.trim="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        label="Buscar"
        hide-details
        single-line
        style="max-width: 250px"
        @keyup.enter="searchInventory"
      />

      <v-divider class="mt-3" />
      <v-data-table
        :headers="headers"
        :items="items"
        :sort-by="['name']"
        :sort-desc="[false, true]"
        class="elevation-1 tableDesktop"
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
import {
  searchnameInventory,
  inventoryGetList
} from "../../../api/modules/inventory";
export default {
  name: "DashboardDataTables",
  data: () => ({
    // dialogDelete: false,
    timeout: 0,
    snackbar: false,
    message: "",
    hidden: false,
    id: null,
    headers: [
      {
        text: "Código",
        value: "codigo"
      },
      {
        text: "Nombre",
        value: "name"
      },
      {
        text: "Precio $",
        value: "priceD"
      },
      {
        text: "Costo $",
        value: "cost"
      },
      {
        text: "Existencia",
        value: "cant"
      },
      {
        text: "Sucursal",
        value: "sucursal"
      }
    ],
    items: [],
    search: "",
    lastUpdated: ""
  }),

  mounted() {
    this.data();
  },
  watch: {
    search(newValue) {
      if (newValue === "") {
        this.data();
      }
    }
  },
  methods: {
    formatNumber(value) {
      if (!value) return "0";
      return new Intl.NumberFormat("de-DE").format(value);
    },

    data: async function() {
      let result;
      result = await inventoryGetList();
      if (result.status == 200) {
        this.items = result.data;
        if (this.items.length > 0) {
          // Obtener el elemento con la fecha de actualización más reciente
          const mostRecentItem = this.items.reduce((prev, current) => {
            return new Date(prev.updatedAt) > new Date(current.updatedAt)
              ? prev
              : current;
          });
          // convert hour utc to vzla
          const utcDate = new Date(mostRecentItem.updatedAt);
          const venezuelanTime = new Date(
            utcDate.setHours(utcDate.getHours() - 4)
          );
          // assign date last update to lastUpdated
          this.lastUpdated = venezuelanTime;
        }
      } else {
        this.dialog = true;
        this.message = result.message.text;
      }
    },
    async searchInventory() {
  try {
    const keywords = this.search.trim();
    const result = await searchnameInventory(keywords);
    console.log("Resultados de búsqueda:", result); 
    this.items = result; 
  } catch (error) {
    console.error("Error en searchInventory:", error);
  }
}
  }
};
</script>

<style scoped>
/* Estilos específicos para pantallas móviles */
</style>
