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
              <v-icon class="mr-2">
                mdi-account-key
              </v-icon>
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
              <v-col class="text-left">
                <strong>Fecha: {{ formatDate(ordersData.createdAt) }}</strong>
              </v-col>
              <v-col class="text-right">
                <strong>Total: {{ totalOrderPrice.toFixed(2) }} bs</strong>
              </v-col>
            </v-footer>
          </template>
        </v-data-table>
        <!-- search client register -->
        <v-divider class="mt-5" />
        <v-autocomplete
          v-model="selectedClient"
          :items="itemsClient"
          label="Seleciona el cliente a agregar"
          item-text="name"
          item-value="id"
          class="purple-input"
          outlined
          @change="updateClientData"
        />
        <v-divider class="mt-5" />
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
          multi-sort
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
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
export default {
  data: () => ({
    tabs: 0,
    option: 0,
    timeout: 0,
    title: "",
    snackbar: "",
    message: "",
    itemsClient: [],
    ordersData: {
      id: "",
      type: "",
      amount: "",
      status: "",
      products: []
    },
    selectedItems: [],
    headers: [
      {
        text: "Código",
        value: "codigo"
      },
      {
        text: "Nombre del",
        value: "product.name"
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
        text: "Precio al Detal",
        value: "priceD"
      },
      {
        text: "Precio al Mayor",
        value: "priceM"
      },
      {
        sortable: false,
        text: "Acciones",
        value: "actions"
      }
    ],
    items: [],
    filteredItems: [],
    searchTerm: "",
    orderHeaders: [
      { text: "Nombre", value: "name" },
      { text: "Precio Unitario", value: "priceD" },
      { text: "Cantidad", value: "quantity" },
      { text: "Precio Total", value: "total" }
    ],
    selectedItems: [],
    maxQuantityError: "",
    clientID: localStorage.getItem("id") || "",
    clientName: localStorage.getItem("name") || ""
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
    this.initialize(), this.data();
    this.getListClient();
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
        this.itemsClient = result.data;
      } else {
        this.dialog = true;
        this.message = result.message.text;
      }
    },
    updateClientData() {
      const client = this.itemsClient.find(
        item => item.id === this.selectedClient
      );
      if (client) {
        this.user.role = "user";
        this.user.address = client.address || "";
        this.user.phone = client.phone || "";
        this.user.name = client.name || "";
        this.user.rif = client.rif || "";
        this.user.codigo = client.codigo || "";
      }
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
      const orderData = {
        priceTotal: this.totalOrderPrice.toString(),
        userId: this.clientID,
        products: this.selectedItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };
      try {
        if (this.roleUser === "user") {
          orderData.codigo = this.user.codigo;
          orderData.nameCli = this.clientName;
        } else if (this.roleUser === "tecnico") {
          orderData.rif = this.user.rif;
          orderData.nameCli = this.clientName;
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
      console.log("Filtered Items:", this.filteredItems);
    }
  }
};
</script>

<style>
.lbl {
  padding: 0.5em;
  margin: auto;
}
</style>
