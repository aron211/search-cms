  /* eslint-disable */
<template>
  <v-container id="Servicios-profile" fluid tag="section">
    <v-row justify="center">
      <base-material-card icon="mdi-account-outline">
        <template v-slot:heading>
          <v-tabs
            v-model="tabs"
            background-color="transparent"
            slider-color="white"
          >
            <v-tab class="mr-3">
              <v-icon class="mr-2"> mdi-account-key </v-icon>
              {{ getTitleButton }}
            </v-tab>
          </v-tabs>
        </template>

        <v-card-text style="height: 100px; position: relative">
          <v-fab-transition>
            <v-btn
              fab
              dark
              small
              color="gray"
              absolute
              right
              top
              @click="$router.go(-1)"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-fab-transition>
        </v-card-text>

        <!-- Encabezado con detalles del pedido -->
        <v-card
          class="mb-4 border border-light"
          style="background-color: #f5f5f5"
          v-if="option === 2"
        >
          <v-card-title>
            <v-row>
              <v-col cols="12" md="3"
                ><strong>Nro del Pedido:</strong> {{ ordersData.codigo }}</v-col
              >
              <v-col cols="12" md="4"
                ><strong>Fecha:</strong>
                {{ formatDate(ordersData.createdAt) }}</v-col
              >
              <v-col cols="12" md="3"
                ><strong>Cliente:</strong> {{ ordersData.cliente }}</v-col
              >
              <v-col cols="12" md="2"
                ><strong>Estatus:</strong> {{ ordersData.status }}</v-col
              >
              <v-col cols="12" md="4"
                ><strong>Nombre Cliente:</strong>
                {{ ordersData.nameCli }}</v-col
              >
              <v-col cols="12" md="4"
                ><strong>RIF:</strong> {{ ordersData.rif }}</v-col
              >
              <!-- <v-col cols="12" md="4" v-if="roleUser === `user`">
              <strong>Código Vendedor:</strong>
                {{ this.clientLogued.codven }}
              </v-col> -->
              <v-col cols="12" md="4" v-if="roleUser === `tecnico`">
                <strong>Código Vendedor:</strong>
                {{ ordersData.codven }}
              </v-col>
              <v-col cols="12" md="4"
                ><strong>Comentario 1:</strong> {{ ordersData.comen1 }}</v-col
              >
              <v-col cols="12" md="4"
                ><strong>Comentario 2:</strong> {{ ordersData.comen2 }}</v-col
              >
              <v-col cols="12" md="4"
                ><strong>Total:</strong>
                {{ totalOrderPrice.toFixed(2) }} bs</v-col
              >
            </v-row>
          </v-card-title>
        </v-card>

        <!-- Table with details of orders created -->
        <v-data-table
          :headers="orderHeaders"
          :items="selectedItems"
          class="elevation-1"
          v-if="option === 2"
        >
          <template v-slot:item.total="{ item }">
            {{ (item.priceD * item.quantity).toFixed(2) }}
          </template>
          <template v-slot:footer>
            <v-footer>
              <v-col cols="12" md="6">
                <strong>Fecha: {{ formatDate(ordersData.createdAt) }}</strong>
              </v-col>
              <!-- <v-col cols="12" md="3" >
                <strong>Código Vendedor: {{ ordersData.codven }} </strong>
              </v-col>
              <v-col cols="12" md="3">
                <strong>Código Cliente: {{ ordersData.cliente }} </strong>
              </v-col> -->
              <v-col cols="12" md="6" class="text-right">
                <strong>Total: {{ totalOrderPrice.toFixed(2) }} bs</strong>
              </v-col>
              <!-- <v-col cols="12" md="3">
                <strong>Número de pedido: {{ ordersData.codigo }} </strong>
              </v-col> -->
            </v-footer>
          </template>
        </v-data-table>
        <!-- search client register -->
        <v-divider class="mt-5" />
        <v-autocomplete
          v-if="this.roleUser === 'tecnico' && option !== 2"
          v-model="selectedClient"
          :items="itemsClient"
          label="Seleciona el cliente a agregar"
          item-text="name"
          item-value="id"
          class="purple-input"
          outlined
          @change="handleClientChange"
        />
        <v-divider class="mt-5" />
        <!-- buscar productos -->
        <v-autocomplete
          v-model="searchTerm"
          :items="items"
          v-if="option !== 2"
          item-value="codigo"
          item-text="name"
          label="Buscar producto"
          clearable
        />

        <!-- Table inventary -->
        <v-divider class="mt-10" />
        <v-data-table
          v-if="option !== 2"
          :headers="headers"
          :items="filteredItems"
          :search.sync="search"
          :sort-by="['id', 'titulo']"
          :sort-desc="[false, true]"
          :items-per-page="5"
          multi-sort
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <div class="d-flex align-center">
            <v-checkbox
              v-model="item.selected"
              :disabled="item.cant <= 0"
              @change="toggleProduct(item)"
            ></v-checkbox>
            <v-text-field
              v-model.number="item.quantity"
              type="number"
              min="1"
              :max="item.cant"
              label="Cantidad"
              v-if="item.selected"
              :rules="[
                v =>
                  item.quantity <= item.cant ||
                  `Maximo disponible: ${item.cant}`
              ]"
              @input="validateQuantity(item)"
              :error-messages="item.errorMessages"
            ></v-text-field>
          </div>
          </template>
        </v-data-table>
        <v-divider class="mt-10" />

        <!-- Table with products selecteds to create new order -->
        <v-data-table
          :headers="orderHeaders"
          :items="selectedItems"
          class="elevation-1"
          v-if="option !== 2"
        >
          <template v-slot:item.total="{ item }">
            {{ (item.priceD * item.quantity).toFixed(2) }}
          </template>
          <template v-slot:footer>
            <v-footer>
              <v-col class="text-right">
                <strong>Total: {{ totalOrderPrice.toFixed(2) }} bs</strong>
              </v-col>
            </v-footer>
          </template>
        </v-data-table>
        <v-btn
          color="success"
          class="mr-0"
          @click="confirmOrder"
          v-if="option !== 2"
        >
          Confirmar Pedido
        </v-btn>
        <div class="text-center">
          <v-snackbar v-model="snackbar" :timeout="timeout" color="#75B768">
            {{ message }}

            <template v-slot:action="{ attrs }">
              <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="snackbar = false"
              >
                Cerrar
              </v-btn>
            </template>
          </v-snackbar>
        </div>
      </base-material-card>
    </v-row>
  </v-container>
</template>

<script>
import i18n from "@/i18n";
import { createorder, GetListorder } from "../../../api/modules/orders";
import { inventoryGetList } from "../../../api/modules/inventory";
import { clientGetList } from "../../../api/modules/client";
import { search } from "core-js/fn/symbol";
export default {
  data: () => ({
    tabs: 0,
    option: 0,
    timeout: 0,
    title: "",
    snackbar: "",
    message: "",
    search: null,
    ordersData: {
      id: "",
      type: "",
      amount: "",
      status: "",
      products: []
    },
    headers: [
      {
        text: "Código",
        value: "codigo"
      },
      {
        text: "Nombre del Producto",
        value: "name"
      },
      {
        text: "Marca",
        value: "marca"
      },
      {
        text: "cantidad",
        value: "cant"
      },
      {
        text: "Precio",
        value: "priceD"
      },
      // {
      //   text: "Precio al Mayor",
      //   value: "priceM"
      // },
      {
        sortable: false,
        text: "Acciones",
        value: "actions"
      }
    ],
    itemsClient: [],
    client: [],
    selectedItems: [],
    // selectedClientData: [],
    selectedClient: null,
    selectedClientData: null,
    items: [],
    filteredItems: [],
    searchTerm: "",
    orderHeaders: [
      { text: "Nombre", value: "name" },
      { text: "Cantidad", value: "quantity" },
      { text: "Precio Unitario", value: "priceD" },
      { text: "Precio Total", value: "total" }
    ],
    maxQuantityError: "",
    clientID: localStorage.getItem("id") || "",
    clientName: localStorage.getItem("name") || "",
    roleUser: localStorage.getItem("rol") || "",
    clientLogued: null
  }),
  computed: {
    getTitle() {
      if (this.option === 1) return "Crear nuevo pedido";
      else if (this.option === 2) return "Ver detalles del pedido";
      else if (this.option === 3) return i18n.t("orders.edit");
      else return i18n.t("orders.head");
    },
    getTitleButton() {
      if (this.option === 1) return "Crear nuevo pedido";
      else if (this.option === 2) return "Ver detalles del pedido";
      else if (this.option === 3) return i18n.t("crud.edit");
      else return i18n.t("orders.head");
    },
    totalOrderPrice() {
      return this.selectedItems.reduce(
        (sum, item) => sum + item.priceD * item.quantity,
        0
      );
    }
  },
  mounted() {
    this.initialize(), this.data(), this.getListClient();
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const formattedDate = date.toISOString().split("T")[0];
      const formattedTime = date.toTimeString().split(" ")[0];
      return `${formattedDate}, ${formattedTime}`;
    },
    async getListClient() {
      let result;
      result = await clientGetList();
      if (result.status == 200) {
        const userEmail = localStorage.getItem("email");

        // this.itemsClient = result.data;

        if (this.roleUser === "tecnico") {
          this.itemsClient = result.data.filter(client => {
            return client.codven === userEmail;
          });
        }

        if (this.roleUser === "user") {
          this.client = result.data;

          this.clientLogued = this.client.find(
            client => client.codigo === userEmail
          );
          if (this.clientLogued) {
          } else {
          }
        }
      } else {
        this.dialog = true;
        this.message = result.message.text;
      }
    },
    filterClients(userEmail) {
      // Filtrar clientes cuyo codven coincide con el userEmail
      this.filteredClients = this.clients.filter(
        client => client.vendor.email === userEmail
      );
    },
    updateClientData() {
      this.selectedClientData = this.itemsClient.find(
        client => client.id === this.selectedClient
      );
    },
    storeClientData() {
      localStorage.setItem(
        "selectedClientData",
        JSON.stringify(this.selectedClientData)
      );
    },
    handleClientChange() {
      this.updateClientData();
      this.storeClientData();
    },

    initialize() {
      this.option = this.$route.params.option;

      if (this.option === 3 || this.option === 2) {
        this.ordersData = this.$route.params.ordersData;

        this.selectedItems = this.ordersData.orderProducts.map(
          orderProduct => ({
            id: orderProduct.product.id,
            codigo: orderProduct.product.codigo,
            name: orderProduct.product.name,
            marca: orderProduct.product.marca,
            cant: orderProduct.product.cant,
            priceD: orderProduct.product.priceD,
            priceM: orderProduct.product.priceM,
            quantity: orderProduct.quantity
          })
        );
      }
    },
    data: async function() {
      let result;
      result = await inventoryGetList();
      if (result.status == 200) {
        this.items = result.data;
        this.filteredItems = result.data;
      } else {
        this.dialog = true;
        this.message = result.message.text;
      }
    },
    async confirmOrder() {
      if (this.selectedItems.length === 0) {
        this.snackbar = true;
        this.message = "No hay productos seleccionados para el pedido";
        return;
      }
      try {
        let orderData = {};
        const userEmail = localStorage.getItem("email") || "";
        const currentDate = new Date().toISOString();

        if (this.roleUser === "user") {
          orderData = {
            // codigo: "00000007", // Asigna el código si es necesario o quítalo si no se usa
            nameCli: this.clientLogued.name,
            priceTotal: this.totalOrderPrice.toString(),
            userEmail: userEmail,
            products: this.selectedItems.map(item => ({
              productId: item.id,
              quantity: item.quantity
            })),
            cliente: userEmail,
            nomCli: this.clientName,
            rif: this.clientLogued.rif,
            codven: this.clientLogued.codven,
            comen1: "",
            comen2: "",
            status: "PE",
            dtot_ped: this.totalOrderPrice.toString()
          };
        } else if (this.roleUser === "tecnico" && this.selectedClientData) {
          orderData = {
            // codigo: this.selectedClientData.rif,
            nameCli: this.selectedClientData.name,
            priceTotal: this.totalOrderPrice.toString(),
            userEmail: userEmail,
            products: this.selectedItems.map(item => ({
              productId: item.id,
              quantity: item.quantity
            })),
            cliente: this.selectedClientData.codigo,
            nomCli: this.selectedClientData.name,
            rif: this.selectedClientData.rif,
            codven: userEmail,
            comen1: "",
            comen2: "",
            status: "PE",
            dtot_ped: this.totalOrderPrice.toString()
          };
        } else {
          this.snackbar = true;
          this.message = "Por favor, selecciona un cliente válido";
          return;
        }

        const response = await createorder(orderData);

        if (response.status === 201) {
          this.snackbar = true;
          this.message = "Pedido realizado exitosamente";

          setTimeout(() => {
            this.$router.push({ name: "Orders" });
          }, 2500);
        } else {
          this.snackbar = true;
          this.message = "Hubo un error al realizar el pedido";
        }
      } catch (error) {
        console.error("Error en confirmOrder:", error);
        this.snackbar = true;
        setTimeout(() => {
                this.snackbar = false;
              }, 2000);
        this.message = "Ocurrió un error al conectarse con el servidor";
      }
    },
    toggleProduct(item) {
      if (item.selected) {
        this.selectedItems.push({ ...item, quantity: item.quantity || 1 });
      } else {
        this.selectedItems = this.selectedItems.filter(
          selectedItem => selectedItem.codigo !== item.codigo
        );
      }
    },
    validateQuantity(item) {
      const maxQuantity = item.cant;
      if (item.quantity > maxQuantity) {
        item.errorMessages = [`Máximo disponible: ${maxQuantity}`];
        item.quantity = maxQuantity;
      } else {
        item.errorMessages = [];
      }

      if (item.quantity > maxQuantity) {
        item.quantity = maxQuantity;
      }

      if (item.selected) {
        const selectedItem = this.selectedItems.find(
          selectedItem => selectedItem.codigo === item.codigo
        );
        if (selectedItem) {
          selectedItem.quantity = item.quantity;
        }
      }
    }
  },

  watch: {
    searchTerm(val) {
      if (val === undefined) {
        this.filteredItems = this.items;
      } else if (val.trim() === "") {
        this.filteredItems = this.items;
      } else {
        this.filteredItems = this.items.filter(
          item =>
            item.name.toLowerCase().includes(val.toLowerCase()) ||
            item.codigo.toLowerCase().includes(val.toLowerCase())
        );
      }
    }
  }
};
</script>

<style>
.lbl {
  padding: 0.1em;
  margin: auto;
}
</style>
