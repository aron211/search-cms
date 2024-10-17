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

        <v-tabs-items v-model="tabs" class="transparent">
          <v-tab-item :key="0">
            <v-form ref="form" lazy-validation>
              <v-container class="py-0">
                <v-row>
                  <v-col cols="12" md="6">
                      <!-- :rules="[rules.required,rules.numberRules,rules.min]" -->
                    <v-text-field
                      v-model="vendor.codven"
                      color="secondary"
                      label="Codigo"
                      class="purple-input"
                      :readonly="option === 2 || option === 3"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="vendor.name"
                      color="secondary"
                      label="Nombre"
                      class="purple-input"
                      :readonly="option === 2"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="vendor.email"
                      color="secondary"
                      label="email"
                      class="purple-input"
                      :readonly="option === 2"
                    />
                  </v-col>
                  <!-- <v-col cols="12" md="6">
                   
                        <v-text-field
                          v-model="vendor.phone"
                          color="secondary"
                          label="Teléfono"
                          :readonly="option === 2"
                        />
                      
                  </v-col> -->
                  <v-col cols="12" class="text-right">
                    <v-btn
                      v-if="option !== 2"
                      color="success"
                      class="mr-0"
                      @click="submit"
                    >
                      {{ getTitleButton }}
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
import { createVendor, updateVendor } from "../../../api/modules/vendor";

export default {
  data: () => ({
    tabs: 0,
    option: 0,
    setTimeout: 0,
    show1: false,
    timeout: 0,
    title: "",
    snackbar: "",
    message: "",
    vendor: {
      id: "",
      ci: "",
      name: "",
      codvem: "",
      email: "",
      lastname: "",
      phone: "",
      createdAt: "",
      updatedAt: ""
    },
    rules: {
      required: value => !!value || "este dato es obligatorio.",
      min: v => v.length = 4 || "Debe contener 4 caracteres numéricos",
      numberRules: v => /^\d+$/.test(v) || "Este campo solo debe contener números",
      lettersRules: v => /^[a-zA-ZÀ-ÿ\s]+$/.test(v) || "Este campo solo debe contener letras",

      //   emailRules: v => /.+@.+\..+/.test(v) || 'el correo deber ser valido. Ejemplo@email.com',
      // passwordMatch: v => v === this.user.password || 'Las contraseñas deben coincidir'

      // emailMatch: () => "El correo y la contraseña no coinciden"
    }
  }),
  computed: {
    getTitle() {
      if (this.option === 1) return "Agregar vendedor";
      else if (this.option === 2) return "Ver detalles";
      else if (this.option === 3) return "Editar";
      else return i18n.t("users.head");
    },
    getTitleButton() {
      if (this.option === 1) return "Agregar";
      else if (this.option === 2) return i18n.t("crud.show");
      else if (this.option === 3) return "Editar";
      else return "Editar";
    }
  },
  mounted() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.option = this.$route.params.option;
      if (this.option === 3 || this.option === 2) {
        this.vendor = this.$route.params.vendorsData;
      }
    },

    async submit() {
      if (this.option === 1) {
        if (this.$refs.form.validate()) {
          // console.log("llamar metodo createVendor")
          let vendor = {
            ci: this.vendor.ci,
            name: this.vendor.name,
            lastname: this.vendor.lastname,
            phone: this.vendor.phone
          };
          // console.log("vendor", vendor)
          const result = await createVendor(vendor);

          if (result.status == 201) {
            this.snackbar = true;
            this.message = "Registro exitoso";

            setTimeout(() => {
              this.$router.push({ name: "Vendors" });
            }, 2000);
          } else {
            this.snackbar = true;
            this.message = "Hubo un error durante el registro";
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
          let id = this.vendor.id;

          let vendor = {
            ci: this.vendor.ci,
            name: this.vendor.name,
            lastname: this.vendor.lastname,
            phone: this.vendor.phone
          };
          // console.log("Vendors update: ", vendor)

          vendor = await updateVendor(id, vendor);
          if (vendor.status == 200) {
            this.snackbar = true;
            this.message = "Actualizacion exitosa";
            setTimeout(() => {
              this.$router.push({ name: "Vendors" });
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
  }
};
</script>

<style>
.lbl {
  padding: 0.5em;
  margin: auto;
}
</style>
