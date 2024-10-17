  /* eslint-disable */
<template>
  <v-app-bar
    absolute
    app
    color="transparent"
    flat
    height="75"
    style="width: auto;"
  >
    <v-btn
      fab
      small
      @click="
        $vuetify.breakpoint.smAndDown
          ? setDrawer(!drawer)
          : $emit('input', !value)
      "
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-spacer />

    <v-toolbar-title class="hidden-sm-and-down">
      Bienvenido {{ name }}
    </v-toolbar-title>

    <v-toolbar-title class="hidden-md-and-up title-navbar">
      Bienvenido {{ name }}
    </v-toolbar-title>

    <div class="mx-3" />

    <!-- <v-btn min-width="0" text>
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn> -->

    <v-menu
      bottom
      left
      min-width="200"
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn min-width="0" text v-bind="attrs" v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list :tile="false" flat nav>
        <template v-for="(p, i) in profile">
          <v-divider v-if="p.divider" :key="`divider-${i}`" class="mb-2 mt-2" />
          <v-btn v-else :key="`item-${i}`" @click="cerrarSesion">
            <app-bar-item>
              <v-list-item-title v-text="p.title" />
            </app-bar-item>
          </v-btn>
        </template>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
// Components
import { VHover, VListItem } from "vuetify/lib";

// Utilities
import { mapState, mapMutations } from "vuex";

export default {
  name: "DashboardCoreAppBar",

  components: {
    AppBarItem: {
      render(h) {
        return h(VHover, {
          scopedSlots: {
            default: ({ hover }) => {
              return h(
                VListItem,
                {
                  attrs: this.$attrs,
                  class: {
                    "black--text": !hover,
                    "white--text secondary elevation-12": hover
                  },
                  props: {
                    activeClass: "",
                    dark: hover,
                    link: true,
                    ...this.$attrs
                  }
                },
                this.$slots.default
              );
            }
          }
        });
      }
    }
  },

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    notifications: [
      "Mike John Responded to your email",
      "You have 5 new tasks",
      `You're now friends with Andrew`,
      "Another Notification",
      "Another one"
    ],
    profile: [
      // { title: 'Profile' },
      // { title: 'Settings' },
      // { divider: true },
      { title: "Cerrar Sesión" }
    ],
    name: "",
    lastname: ""
  }),

  computed: {
    ...mapState(["drawer"])
  },

  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER"
    }),
    cerrarSesion() {
      // console.log('cerrar sessio')
      localStorage.clear();
      this.$router.push("/");
    },
    datauser() {
      const storedName = localStorage.getItem("name");
      const storedlastName = localStorage.getItem("lastName");
      // console.log('Nombre almacenado:', storedName); // Verifica el valor almacenado
      // console.log('Nombre almacenado:', storedlastName); // Verifica el valor almacenado
      this.name = storedName;
      this.lastname = storedlastName;
    }
  },

  mounted() {
    this.datauser();
  }
};
</script>
<style scoped>
.title-navbar{
  font-size: 15px;
}
</style>