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
              <v-icon class="mr-2">mdi-account-key</v-icon>
              <!-- {{ getTitleButton }} -->
              Usuarios
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

        <v-tabs-items v-model="tabs" class="transparent">
          <v-tab-item :key="0">
            <v-form ref="form" lazy-validation>
              <v-col cols="12" md="12">
                    <h3 :hidden="option == 2 || option === 3">
                      Seleccione el tipo de usuario a registrar
                    </h3>
                    <br />
                  </v-col>
              <v-col cols="12" md="6" v-if="option === 1">
                <v-select
                  v-model="selectedUserType"
                  :items="userTypes"
                  label="¿Qué tipo de usuario quiere agregar?"
                  class="purple-input"
                  outlined
                />
                <!-- search client register -->
                <v-autocomplete
                  v-if="selectedUserType === 'Cliente'"
                  v-model="selectedClient"
                  :items="itemsClient"
                  label="Seleciona el cliente a agregar"
                  item-text="name"
                  item-value="id"
                  class="purple-input"
                  outlined
                  @change="updateClientData"
                />
                <!-- search vendor register -->
                <v-autocomplete
                  v-if="selectedUserType === 'Vendedor'"
                  v-model="selectedVendor"
                  :items="itemsVendor"
                  label="Seleciona el Vendedor a agregar"
                  item-text="name"
                  item-value="id"
                  class="purple-input"
                  outlined
                  @change="updateVendorData"
                />
              </v-col>
              <!-- textfields with client -->
              <v-container class="py-0">
                <v-row v-if="selectedUserType === 'Cliente'">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="user.name"
                      label="Nombre del Cliente"
                      class="purple-input"
                      :readonly="option === 1 || option === 2"
                      :rules="[rules.required]"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="user.codigo"
                      label="Código"
                      class="purple-input"
                      :readonly="option === 1 || option === 2"
                      :rules="[rules.required]"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-if="selectedUserType === 'Cliente'"
                      v-model="user.rif"
                      label="Rif"
                      class="purple-input"
                      :readonly="option === 1 || option === 2"
                      :rules="[rules.required]"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="user.phone"
                      color="secondary"
                      label="Teléfono"
                      :rules="[rules.required]"
                      :readonly="option === 1 || option === 2"
                    />
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-if="selectedUserType === 'Cliente'"
                      v-model="user.address"
                      label="Direccion"
                      class="purple-input"
                      :readonly="option === 2"
                      :rules="[rules.required]"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-if="selectedUserType === 'Cliente'"
                      v-model="user.lastname"
                      label="Email"
                      class="purple-input"
                      :readonly="option === 2"
                      :rules="[rules.required]"
                    />
                  </v-col>
                </v-row>
                <!-- textfields with Vendord -->
                <v-row v-if="selectedUserType === 'Vendedor'">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="user.name"
                      label="Nombre del Vendedor"
                      class="purple-input"
                      :readonly="option === 1 || option === 2"
                      :rules="[rules.required]"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="user.rif"
                      label="Codigo"
                      class="purple-input"
                      :readonly="option === 1 || option === 2"
                      :rules="[rules.required]"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="user.lastname"
                      label="Email"
                      class="purple-input"
                      :readonly="option === 1 || option === 2"
                      :rules="[rules.required]"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="12">
                    <h3 :hidden="option == 2 || option === 3">
                      Ingrese contraseña con el que el
                      usuario ingresara al sistema
                    </h3>
                    <br />
                  </v-col>
                  <v-col
                    v-if="selectedUserType === 'Vendedor'"
                    :hidden="option == 3"
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="user.rif"
                      label="Nombre de usuario"
                      class="purple-input"
                      :readonly="true"
                      :rules="[rules.required]"
                    />
                  </v-col>
                  <v-col
                    v-if="selectedUserType === 'Cliente'"
                    :hidden="option == 3"
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="user.codigo"
                      label="Nombre de usuario"
                      class="purple-input"
                      :readonly="true"
                      :rules="[rules.required]"
                    />
                  </v-col>
                  <v-col :hidden="option === 2" cols="12" md="6">
                    <v-text-field
                    v-if="option !==2"
                      v-model="user.password"
                      :type="show1 ? 'text' : 'password'"
                      :append-icon="show1 ? 'mdi-eye' : ' mdi-eye-off'"
                      :rules="[rules.required, rules.min]"
                      label="Ingrese una contraseña"
                      prepend-icon="mdi-lock-outline"
                      class="purple-input"
                      hint="At least 6 characters"
                      :readonly="option === 3"
                      counter
                      @click:append="show1 = !show1"
                    />
                  </v-col>
                  <v-col cols="12" class="text-right">
                    <v-btn
                      v-if="option !== 2"
                      color="success"
                      class="mr-0"
                      @click="submit"
                    >
                      <!-- {{ getTitleButton }} -->
                      Agregar Usuario
                    </v-btn>
                  </v-col>
                </v-row>

                <div class="text-center">
                  <v-snackbar
                    v-model="snackbar"
                    :timeout="timeout"
                    color="#75B768"
                  >
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
              </v-container>
            </v-form>
          </v-tab-item>
        </v-tabs-items>
      </base-material-card>
    </v-row>
  </v-container>
</template>

<script>
import i18n from "@/i18n";
import { createUser, updateUser } from "../../../api/modules/user";
import { vendorGetList } from "../../../api/modules/vendor";
import { clientGetList } from "../../../api/modules/client";
import { apiHttp } from "../../../api/axiosApi";

export default {
  data: () => ({
    tabs: 0,
    option: 0,
    setTimeout: 0,
    timeout: 0,
    show1: false,
    title: "",
    snackbar: "",
    message: "",
    user: {
      id: "",
      name: "",
      lastname: "",
      email: "",
      password: "",
      role: "",
      urlAvatar: "",
      reference: "",
      address: "",
      phone: "",
      code: "",
      createdAt: "",
      updatedAt: ""
    },
    client: {
      id: "",
      name: "",
      codigo: "",
      rif: "",
      address: "",
      phone: ""
    },
    vendor: {
      id: "",
      ci: "",
      name: "",
      lastname: "",
      codven: "",
      email: "",
      phone: ""
    },
    userTypes: ["Cliente", "Vendedor"],
    selectedUserType: null,
    selectedClient: null,
    selectedVendor: null,
    itemsClient: [],
    itemsVendor: [],
    roles: [
      {
        name: "admin"
      },
      {
        name: "tecnico"
      },
      {
        name: "user"
      }
    ],
    rules: {
      required: value => !!value || "este dato es obligatorio.",
      min: v => v.length >= 6 || "Mínimo 6 caracteres",
      emailRules: v =>
        /.+@.+\..+/.test(v) || "el correo deber ser valido. Ejemplo@email.com"
      // passwordMatch: v => v === this.user.password || 'Las contraseñas deben coincidir'

      // emailMatch: () => "El correo y la contraseña no coinciden"
    }
  }),
  computed: {
    getTitle() {
      if (this.option === 1) return i18n.t("users.create");
      else if (this.option === 2) return i18n.t("users.show");
      else if (this.option === 3) return i18n.t("users.edit");
      else return i18n.t("users.head");
    },
    getTitleButton() {
      if (this.option === 1) return i18n.t("crud.create");
      else if (this.option === 2) return i18n.t("crud.show");
      else if (this.option === 3) return i18n.t("crud.edit");
      else return i18n.t("users.head");
    }
  },
  mounted() {
    this.initialize();
    this.getListClient();
    this.getListVendor();
  },

  methods: {
    initialize() {
      this.option = this.$route.params.option;
      if (this.option === 3 || this.option === 2) {
        this.user = this.$route.params.usersData;
      }
      // console.log('User data initialized:', this.user);
      if (this.userType === "Cliente") {
        this.user.role = "user";
      } else if (this.userType === "Vendedor") {
        this.user.role = "tecnico";
      }
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
    async getListVendor() {
      let result;
      result = await vendorGetList();
      if (result.status == 200) {
        this.itemsVendor = result.data;
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
        this.user.lastname = client.email || "";
        this.user.rif = client.rif || "";
        this.user.codigo = client.codigo || "";
      }
    },
    updateVendorData() {
      const vendor = this.itemsVendor.find(
        item => item.id === this.selectedVendor
      );
      if (vendor) {
        this.user.role = "tecnico";
        this.user.rif = vendor.codven || "";
        this.user.name = vendor.name || "";
        this.user.lastname = vendor.email || "";
        this.user.phone = vendor.phone || "";
        this.user.address = "default";
        this.user.codigo = "001";
      }
    },
    async submit() {
      if (this.option === 1) {
        if (this.$refs.form.validate()) {
          let user = {};
          if (this.selectedUserType === "Vendedor") {
            user = {
              role: this.user.role,
              name: this.user.name,
              lastname: ".",
              email: this.user.rif,
              reference: this.user.lastname,
              password: this.user.password,
              address: this.user.address,
              phone: ".",
              rif: this.user.rif || "1",
              codigo: this.user.codigo || "1"
            };
          } else if (this.selectedUserType === "Cliente") {
            user = {
              role: this.user.role,
              name: this.user.name,
              lastname: ".",
              email: this.user.codigo,
              reference: this.user.lastname,
              password: this.user.password,
              address: this.user.address,
              phone: ".",
              rif: this.user.rif || "1",
              codigo: this.user.codigo || "1"
            };
          }

          try {
            const result = await apiHttp("post", "/api/v1/auth/register", user);

            if (result.status == 201) {
              this.snackbar = true;
              this.message = "Registro exitoso";
              setTimeout(() => {
                this.$router.push({ name: "Users" });
              }, 2000);
            } else {
              this.snackbar = true;
              this.message =
                result.message.text || "Ocurrió un error durante el registro";
              setTimeout(() => {
                this.snackbar = false;
              }, 1000);
            }
          } catch (error) {
            console.error("Error en la solicitud:", error);
            this.snackbar = true;
            this.message = "Ocurrió un error durante la solicitud";
            setTimeout(() => {
              this.snackbar = false;
            }, 1000);
          }
        } else {
          this.snackbar = true;
          this.message = "Debe llenar todos los campos requeridos";
          setTimeout(() => {
            this.snackbar = false;
          }, 1000);
        }
      }
      if (this.option === 3) {
        if (this.$refs.form.validate()) {
          let id = this.user.id;

          let user = {
            name: this.user.name,
            lastname: this.user.lastname,
            reference: this.user.reference,
            address: this.user.address,
            phone: this.user.phone
          };

          user = await updateUser(id, user);
          if (user.status == 200) {
            this.snackbar = true;
            this.message = "Actualizacion exitosa";
            setTimeout(() => {
              this.$router.push({ name: "Users" });
            }, 2000);
          } else {
            this.snackbar = true;
            this.message = "Hubo un error durante la actualizacion";
            setTimeout(() => {
              this.snackbar = false;
            }, 1000);
          }
        } else {
          this.snackbar = true;
          this.message = "Debe llenar todos los campos requeridos";
          setTimeout(() => {
            this.snackbar = false;
          }, 1000);
        }
      }
    }
  },
  watch: {
    selectedUserType(newType) {
      if (newType === "Cliente") {
        this.user.role = "user";
      } else if (newType === "Vendedor") {
        this.user.role = "tecnico";
      }
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
