  /* eslint-disable */
<template>
  <v-container id="data-tables" tag="section">
    <base-material-card
      color="greenligth"
      icon="mdi-format-page-break"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          <!-- {{ $t("orders.head") }} -->
          Pedidos
        </div>
      </template>

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        label="Buscar"
        hide-details
        single-line
        style="max-width: 250px;"
      />

      <v-divider class="mt-3" />

      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        :sort-by="['codigo', 'createdAt', 'priceTotal', 'status']"
        :sort-desc="[false]"
        :items-per-page="5"
        multi-sort
        class="elevation-1"
      >
        <template v-slot:[`item.priceTotal`]="{ item }">
          {{ formatPrice(item.priceTotal) }}
        </template>
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="item.status === 'PE' ? 'yellow' : 'green'"
            text-color="black"
            dark
          >
            {{ item.status === "PE" ? "Pendiente" : "Recibido" }}
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            :key="1"
            color="gray"
            fab
            class="px-1 ml-1"
            x-small
            @click="show(item)"
          >
            <v-icon small v-text="'mdi-eye'" />
          </v-btn>
          <!-- <v-btn
            :key="2"
            color="four"
            fab
            class="px-1 ml-1"
            x-small
            @click="edit(item)"
          >
            <v-icon small v-text="'mdi-check'" />
          </v-btn> -->
          <!--<v-btn
            :key="3"
            color="primary"
            fab
            class="px-1 ml-1"
            x-small
            @click="deleteorders(item)"
          >
            <v-icon
              small
              v-text="'mdi-delete'"
            />
          </v-btn>-->
        </template>
      </v-data-table>

      <v-card-text style="height: 100px; position: relative">
        <v-fab-transition>
          <v-btn
            fab
            dark
            large
            color="grenndark"
            style="position: absolute; bottom: 16px; right: 16px;"
            v-if="this.roleUser !== `admin`"
            @click="create"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-card-text>
      <div class="text-center">
        <v-snackbar v-model="snackbar" :timeout="timeout" color="#75B768">
          {{ message }}

          <template v-slot:action="{ attrs }">
            <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </div>
      <!-- <v-dialog v-model="dialogDelete" persistent max-width="500px">
        <v-card>
          <v-card-title class="text-h5">
            Estas seguro que deseas eliminar esta orden?
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeDelete">
              Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="deleteItemConfirm">
              OK
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog> -->
    </base-material-card>
  </v-container>
</template>

<script>
import i18n from "@/i18n";
import { GetListorder } from "../../../api/modules/orders";
export default {
  name: "DashboardDataTables",
  data: () => ({
    // dialogDelete: false,
    snackbar: false,
    message: "",
    hidden: false,
    timeout: 0,
    idord: null,
    roleUser: localStorage.getItem("rol") || "",
    headers: [
      // {
      //   text: 'Código',
      //   value: 'codigo',
      // },
      {
        text: "Nombre del cliente",
        value: "nameCli",
        sortable: false
      },
      {
        text: "Codigo del cliente",
        value: "cliente",
        sortable: false
      },
      {
        text: "Nro Pedido",
        value: "codigo"
      },
      {
        text: "Monto total",
        value: "priceTotal"
      },
      {
        text: "Fecha",
        value: "createdAt"
      },
      {
        text: "Estatus",
        value: "status"
      },
      {
        sortable: false,
        text: "Acciones",
        value: "actions"
      }
    ],
    items: [],
    search: undefined
  }),
  async mounted() {
    this.data();
  },
  computed: {
    filteredItems() {
      const logguedCodven = localStorage.getItem("email");
      const roleUser = this.roleUser;

      if (roleUser === "admin") {
        return this.items.filter(item => item.codven !== logguedCodven);
      }
      return this.items.filter(item => item.codven === logguedCodven);
    }
  },
  mounted() {
    this.data();
  },
  methods: {
    data: async function() {
      let result;
      result = await GetListorder();
      if (result.status == 200) {
        this.items = result.data;
      } else {
        this.dialog = true;
        this.message = result.message.text;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const formattedDate = date.toISOString().split("T")[0];
      const formattedTime = date.toTimeString().split(" ")[0];
      return `${formattedDate}, ${formattedTime}`;
    },
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },
    create() {
      this.$router.push({
        name: "OrdersForm",
        params: {
          option: 1 // option 1 to create
        }
      });
    },
    show(item) {
      this.$router.push({
        name: "OrdersForm",
        params: {
          option: 2, // option 2 to show
          ordersData: item
        }
      });
    }
    // deleteorder(item) {
    //   this.idord = item.id;
    //   this.dialogDelete = true;
    // },
    // closeDelete() {
    //   this.dialogDelete = false;
    // },

    // deleteOrderConfirm() {
    //   this.dialogDelete = false;
    // },
    // async deleteOrderConfirm() {
    //   let result;
    //   result = await deleteorder(this.idord);
    //   console.log("🚀 ~ deleteItemConfirm ~ result:", result);
    //   if (result === "OK") {
    //     this.snackbar = true;
    //     this.message = "Eliminación exitosa";
    //     this.data();
    //     this.dialogDelete = false;
    //     setTimeout(() => {
    //       this.$router.push({ name: "Order" });
    //     }, 1000);
    //   } else {
    //     this.snackbar = true;
    //     this.message = "ocurrio un error al eliminar la orden";
    //     setTimeout(() => {
    //       this.snackbar = false;
    //     }, 1000);
    //   }
    // }
  }
};
</script>

<style></style>
