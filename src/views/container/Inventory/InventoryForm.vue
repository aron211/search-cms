<template>
  <v-container id="Servicios-profile" fluid tag="section">
    <v-row justify="center">
      <base-material-card icon="mdi-account-outline">
        <template v-slot:heading>
          <v-tabs v-model="tabs" background-color="transparent" slider-color="white">
            <v-tab class="mr-3">
              <v-icon class="mr-2">mdi-account-key</v-icon>
              <!-- {{ getTitleButton }} -->
              Clientes
            </v-tab>
          </v-tabs>
        </template>

        <v-card-text style="height: 100px; position: relative">
          <v-fab-transition>
            <v-btn fab dark small color="gray" absolute right top @click="$router.go(-1)">
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
                    <v-text-field v-model="client.name" label="Nombre" class="purple-input" :readonly="option === 2"
                      :rules="[rules.required]" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="client.rif" label="Rif" class="purple-input" :readonly="option === 2" />
                  </v-col>
                  <v-col :hidden="option == 3" cols="12" md="6">
                    <v-text-field v-model="client.codigo" label="Codigo" class="purple-input"
                      :readonly="option === 2 || option === 3" :rules="[rules.emailRules]" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="client.address" label="Direccion" class="purple-input"
                      :readonly="option === 2" :rules="[rules.required]" />
                  </v-col>
                  <v-col cols="12" md="6">

                    <v-text-field v-model="client.phone" color="secondary" label="Teléfono" :rules="[rules.required]"
                      :readonly="option === 2" />

                  </v-col>
                  <v-col cols="12" class="text-right">
                    <v-btn v-if="option !== 2" color="success" class="mr-0" @click="submit">
                      <!-- {{ getTitleButton }} -->
                      Agregar Cliente
                    </v-btn>
                  </v-col>
                </v-row>

                <div class="text-center">
                  <v-snackbar v-model="snackbar" :timeout="timeout" color="#75B768">
                    {{ message }}

                    <template v-slot:action="{ attrs }">
                      <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
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
import i18n from '@/i18n'
import { createClient } from '../../../api/modules/client'

export default {

  data: () => ({
    tabs: 0,
    option: 0,
    setTimeout: 0,
    show1: false,
    title: '',
    snackbar: '',
    message: '',

    user: {
      id: '',
      name: '',
      codigo: '',
      rif: '',
      password: '',
      role: '',
      urlAvatar: '',
      reference: '',
      address: '',
      phone: '',
      code: '',
      createdAt: '',
      updatedAt: ''
    },
    client: {
      id: "",
      codigo: "",
      name: "",
      rif: "",
      address: "",
      phone: "",
      createdAt: "",
      updatedAt: ""
    },
    rules: {
      required: value => !!value || 'este dato es obligatorio.',
      min: v => v.length >= 6 || 'Mínimo 6 caracteres',
      //   emailRules: v => /.+@.+\..+/.test(v) || 'el correo deber ser valido. Ejemplo@email.com',
      // passwordMatch: v => v === this.user.password || 'Las contraseñas deben coincidir'

      // emailMatch: () => "El correo y la contraseña no coinciden"
    },


  }),
  computed: {
    getTitle() {
      if (this.option === 1) return i18n.t('users.create')
      else if (this.option === 2) return i18n.t('users.show')
      else if (this.option === 3) return i18n.t('users.edit')
      else return i18n.t('users.head')
    },
    getTitleButton() {
      if (this.option === 1) return i18n.t('crud.create')
      else if (this.option === 2) return i18n.t('crud.show')
      else if (this.option === 3) return i18n.t('crud.edit')
      else return i18n.t('users.head')
    },
  },
  mounted() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.option = this.$route.params.option
      if (this.option === 3 || this.option === 2) {
        this.client = this.$route.params.clientData;
      }


    },

    async submit() {
      if (this.option === 1) {
        if (this.$refs.form.validate()) {

          let client = {
            codigo: this.client.codigo,
            name: this.client.name,
            rif: this.client.rif,
            address: this.client.address,
            phone: this.client.phone,
          }

          const result = await createClient(client)


          if (result.status == 201) {

            this.snackbar = true
            this.message = 'Registro exitoso'

            setTimeout(() => {
              this.$router.push({ name: 'Client' })
            }, 2000)
          } else {

            this.snackbar = true
            this.message = 'Hubo un error durante el registro'
            setTimeout(() => {
              this.snackbar = false
            }, 1000)
          }

        } else {
          this.snackbar = true
          this.message = 'Debe llenar todos los campos requeridos'
          setTimeout(() => {
            this.snackbar = false
          }, 1000)
        }
      }
      if (this.option === 3) {
        if (this.$refs.form.validate()) {

          let id = this.client.id

          let client = {
            name: this.client.name,
            codigo: this.client.codigo,
            address: this.client.address,
            phone: this.client.phone,
          }

          // user = await updateUser(id,client)
          if (user.status == 200) {
            this.snackbar = true
            this.message = 'Actualizacion exitosa'
            setTimeout(() => {
              this.$router.push({ name: 'Client' })
            }, 2000)
          } else {
            this.snackbar = true
            this.message = 'Hubo un error durante la actualizacion'
            setTimeout(() => {
              this.snackbar = false
            }, 1000)
          }
        } else {
          this.snackbar = true
          this.message = 'Debe llenar todos los campos requeridos'
          setTimeout(() => {
            this.snackbar = false
          }, 1000)
        }
      }
    },
  },
}
</script>

<style>
.lbl {
  padding: 0.5em;
  margin: auto;
}
</style>