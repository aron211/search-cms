<template>
  <v-navigation-drawer id="core-navigation-drawer" v-model="drawer"
    :dark="barColor !== 'rgba(117, 183, 104, 1), rgba(20, 126, 72, 0.7)'" :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl" mobile-break-point="960" app width="260" v-bind="$attrs">
    <!-- img dentro del v-navigation-drawer
     :src="barImage" -->
    <template v-slot:img="props">
      <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
    </template>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-uppercase font-weight-regular display-2">
          <!-- <v-img :src="logo" class="img-Logo" /> -->
                <v-icon large>
        mdi-magnify
      </v-icon>
          <!-- <span class="logo-mini">{{ $t("ct") }}</span>
          <span class="logo-normal">{{ $t("tim") }}</span>
          -->
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider class="mb-1" />

    <!-- <v-list
      dense
      nav
    >
      <base-item-group :item="profile" />
    </v-list>

    <v-divider class="mb-2" /> -->

    <v-list expand nav>
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
      <!--  -->
      <template v-for="(item, i) in computedItems">
        <!-- grupo de item, ejemplo: users, pages, roles -->
        <base-item-group v-if="item.children" :key="`group-${i}`" :item="item">
          <!--  -->
        </base-item-group>
        <!-- item solos, ejemplo blog -->
        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapState } from 'vuex'
// import logo from '../../../../assets/LogoVitalFix.png'
import logo from '../../../../assets/pedidos.jpg'

export default {
  name: 'DashboardCoreDrawer',

  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    logo,
    items: [],

  }),

  computed: {
    ...mapState(['barColor', '']),
    drawer: {
      get() {
        return this.$store.state.drawer
      },
      set(val) {
        this.$store.commit('SET_DRAWER', val)
      },
    },
    computedItems() {
      return this.items.map(this.mapItem)
    },
    profile() {
      return {
        avatar: true,
        group: '',
        title: this.$t('avatar'),
        children: [
          {
            href: '',
            title: this.$t('my-profile'),
          },
          {
            to: '',
            title: this.$t('edit-profile'),
          },
          {
            to: '',
            title: this.$t('settings'),
          },
        ],
      }
    },
  },

  watch: {
    '$vuetify.breakpoint.smAndDown'(val) {
      this.$emit('update:expandOnHover', !val)
    },
  },
  mounted() {
    this.setMenuItems()
  },

  methods: {

    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title),
      }
    },
    setMenuItems() {
      this.items = [
        {
          group: '/home',
          icon: 'mdi-view-dashboard',
          title: 'DASHBOARD',
          to: '/home/Dashboard',
        },
        {
          group: '/home',
          icon: 'mdi-plus-network',
          title: 'Inventario',
          to: '/home/inventory/inventory',
        },
        
      ]
      // const role = localStorage.getItem('rol');
      // if (role === 'admin') {
      //   this.items = [
      //     {
      //       group: '/home',
      //       icon: 'mdi-view-dashboard',
      //       title: 'DASHBOARD',
      //       to: '/home/Dashboard',
      //     },
      //     {
      //       group: '/home',
      //       icon: 'mdi-plus-network',
      //       title: 'Usuarios',
      //       to: '/home/users/users',
      //     },
      //     {
      //       group: '/home',
      //       icon: 'mdi-plus-network',
      //       title: 'Clientes',
      //       to: '/home/Clients/Clients',
      //     },
      //     {
      //       group: '/home',
      //       icon: 'mdi-plus-network',
      //       title: 'Vendedores',
      //       to: '/home/Vendors/Vendors',
      //     },
      //     {
      //       group: '/home',
      //       icon: 'mdi-plus-network',
      //       title: 'Inventario',
      //       to: '/home/inventory/inventory',
      //     },
      //     {
      //       group: '/home',
      //       icon: 'mdi-plus-network',
      //       title: 'Pedidos',
      //       to: '/home/Orders/Orders',
      //     },

      //   ]
      // } else if (role === 'tecnico') {
      //   this.items = [
      //     {
      //       group: '/home',
      //       icon: 'mdi-view-dashboard',
      //       title: 'DASHBOARD',
      //       to: '/home/Dashboard',
      //     },
      //     {
      //       group: '/home',
      //       icon: 'mdi-plus-network',
      //       title: 'Mis Clientes',
      //       to: '/home/myclients/myclients',
      //     },
      //     {
      //       group: '/home',
      //       icon: 'mdi-plus-network',
      //       title: 'Pedidos',
      //       to: '/home/Orders/Orders',
      //     },
      //   ];
      // }
      // else if (role === 'user') {
      //   this.items = [
      //     {
      //       group: '/home',
      //       icon: 'mdi-view-dashboard',
      //       title: 'DASHBOARD',
      //       to: '/home/Dashboard',
      //     },
      //     {
      //       group: '/home',
      //       icon: 'mdi-plus-network',
      //       title: 'Pedidos',
      //       to: '/home/Orders/Orders',
      //     },
      //   ];
      // }
    },
  },
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  &.v-navigation-drawer--mini-variant
    .v-list-item
      justify-content: flex-start !important

    .v-list-group--sub-group
      display: block !important

  .v-list-group__header.v-list-item--active:before
    opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px

      +ltr()
        margin-right: 24px
        margin-left: 12px !important

      +rtl()
        margin-left: 24px
        margin-right: 12px !important

  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group
    .v-list-item
      +ltr()
        padding-left: 8px

      +rtl()
        padding-right: 8px

    .v-list-group__header
      +ltr()
        padding-right: 0

      +rtl()
        padding-right: 0

      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2

        +ltr()
          margin-right: 8px

        +rtl()
          margin-left: 8px
</style>

<style scoped>
.img-Logo {
  /* width: 20vw;
  height: 10vh; */
  display: flex;
  justify-items: flex-end;
  /* background-image: url("../../../assets/logoHumedal.png"); */
}
</style>
