<template>
  <v-container id="data-tables" tag="section">
    <base-material-card
      icon="mdi-account-group"
      color="greenlight"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <!-- <div class="display-2 font-weight-light">
          Inventario
          <h3 style="font-size: 12px;">
            Última actualización:
            {{ lastUpdated ? lastUpdated : "No disponible" }}
          </h3>
        </div> -->
        <div class="display-2 font-weight-light">
    Inventario
    <h3 style="font-size: 12px;">
      Última actualización general:
      {{ lastUpdated ? lastUpdated : "No disponible" }}
    </h3>
  </div>

  <v-divider class="my-3" />

  <div class="branch-updates">
    <h4 style="font-size: 14px;">Última actualización por sucursal:</h4>
    <ul>
      <li>LA19: {{ lastUpdatedBranches.LA19 || "No disponible" }}</li>
      <li>LA42: {{ lastUpdatedBranches.LA42 || "No disponible" }}</li>
      <li>TOCUYO: {{ lastUpdatedBranches.TOCUYO || "No disponible" }}</li>
      <li>SUPLI: {{ lastUpdatedBranches.SUPLI || "No disponible" }}</li>
      <li>YARACUY: {{ lastUpdatedBranches.YARACUY || "No disponible" }}</li>
    </ul>
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
        @keyup.enter="searchInventory"
      />

      <v-divider class="mt-3" />
      <v-data-table
        :headers="headers"
        :items="currentItems"
     
        :items-per-page="-1"
        :sort-by="['name']"
        :sort-desc="[false, true]"
        class="elevation-1 tableDesktop"
        :loading="loading"
      >
        <template v-slot:item.cant="{ item }">
          {{ formatNumber(item.cant) }}
        </template>
      </v-data-table>

      <!-- Controles de paginado -->
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        class="mt-4"
        @input="handlePageChange"
      ></v-pagination>
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
    loading: false,
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
    lastUpdated: "",
    currentPage: 1,
    itemsPerPage: 10,
    lastUpdatedBranches: {
    LA19: null,
    LA42: null,
    TOCUYO: null,
    SUPLI: null,
    YARACUY: null,
  },
  }),

  computed: {
    totalPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    currentItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.items.slice(start, start + this.itemsPerPage);
    }
  },

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
    formatNumber(value) {
      if (!value) return "0";
      return new Intl.NumberFormat("de-DE").format(value);
    },

    debounceSearch: _.debounce(function() {
      this.searchInventory();
    }, 4000),

    async fetchData() {
  this.loading = true;
  try {
    const result = await inventoryGetList();
    if (result.status === 200) {
      this.items = result.data;
      console.log("Datos del inventario recibidos:", this.items);  // Ver todos los datos recibidos

      // Mapear los nombres de las sucursales correctos con los nombres simplificados
      const branchMap = {
        "RUBEN LA 19": "LA19",
        "RUBEN LA 42": "LA42",
        "EL TOCUYO": "TOCUYO",
        "SUPLI EL ROSARIO": "SUPLI",
        "YARACUY": "YARACUY"
      };
      
      Object.keys(branchMap).forEach(branch => {
        console.log("Procesando sucursal:", branch);  // Ver qué sucursal estamos procesando

        const itemsForBranch = this.items.filter(item => {
          const normalizedSucursal = item.sucursal.trim().toLowerCase();
          const normalizedBranch = branch.trim().toLowerCase();
          return normalizedSucursal === normalizedBranch;
        });

        if (itemsForBranch.length > 0) {
          console.log(`Items encontrados para ${branch}:`, itemsForBranch);
          const mostRecent = itemsForBranch.reduce((prev, current) =>
            new Date(prev.updatedAt) > new Date(current.updatedAt) ? prev : current
          );
          // Asignar la última actualización por sucursal
          const branchKey = branchMap[branch];  // Usar el nombre simplificado
          this.lastUpdatedBranches[branchKey] = new Date(mostRecent.updatedAt).toLocaleString("es-VE", { timeZone: "America/Caracas", hour12: false });
          console.log(`Última actualización para ${branch}:`, this.lastUpdatedBranches[branchKey]);
        } else {
          // Si no hay items para la sucursal, mostrar "No disponible"
          const branchKey = branchMap[branch];  // Usar el nombre simplificado
          this.lastUpdatedBranches[branchKey] = "No disponible";
          console.log(`No se encontraron items para ${branch}`);
        }
      });

      // Obtener la última actualización general
      if (this.items.length > 0) {
        const mostRecentItem = this.items.reduce((prev, current) =>
          new Date(prev.updatedAt) > new Date(current.updatedAt) ? prev : current
        );
        this.lastUpdated = new Date(mostRecentItem.updatedAt).toLocaleString("es-VE", { timeZone: "America/Caracas", hour12: false });
        console.log("Última actualización general:", this.lastUpdated);
      } else {
        this.lastUpdated = "No disponible";
        console.log("No hay items en el inventario.");
      }

      this.loading = false;
    }
  } catch (error) {
    console.error("Error fetching inventory:", error);
    this.loading = false;
  }
}

,

    // async fetchData() {
    //   this.loading = true;
    //   const cachedData = sessionStorage.getItem("inventoryData");
    //   const cachedUpdateTime = sessionStorage.getItem("lastUpdated");

    //   if (cachedData && cachedUpdateTime) {
    //     this.items = JSON.parse(cachedData);
    //     this.lastUpdated = cachedUpdateTime;
    //     this.loading = false;
    //   } else {
    //     try {
    //       const result = await inventoryGetList();
    //       if (result.status === 200) {
    //         this.items = result.data;
    //         if (this.items.length > 0) {
    //           const mostRecentItem = this.items.reduce((prev, current) =>
    //             new Date(prev.updatedAt) > new Date(current.updatedAt) ? prev : current
    //           );
    //           const options = { timeZone: "America/Caracas", hour12: false };
    //           this.lastUpdated = new Date(mostRecentItem.updatedAt).toLocaleString("es-VE", options);
    //           sessionStorage.setItem("inventoryData", JSON.stringify(this.items));
    //           sessionStorage.setItem("lastUpdated", this.lastUpdated);
    //         }
    //       } else {
    //         this.message = result.message.text;
    //       }
    //     } catch (error) {
    //       console.error("Error fetching inventory:", error);
    //     } finally {
    //       this.loading = false;
    //     }
    //   }
    // },

    async searchInventory() {
      this.loading = true;
      try {
        const keywords = this.search.trim();
        const result = await searchnameInventory(keywords);
        this.items = result;
        this.currentPage = 1;
      } catch (error) {
        console.error("Error en searchInventory:", error);
      } finally {
        this.loading = false;
      }
    },

    handlePageChange(page) {
      this.currentPage = page;
    }
  }
};
</script>
