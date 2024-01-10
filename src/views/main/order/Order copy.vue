

<template>
  <div>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template v-slot:activator="{ on }">
                <v-text-field v-model="filters.startDate" label="创建时间范围起始日期" prepend-icon="mdi-calendar" readonly
                  v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="filters.startDate" @input="menu = false"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="9">
            <v-menu v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template v-slot:activator="{ on }">
                <v-text-field v-model="filters.endDate" label="创建时间范围结束日期" prepend-icon="mdi-calendar" readonly
                  v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="filters.endDate" @input="menu2 = false"></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="filters.orderId" label="订单ID"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn color="primary" @click="handleSearch">查询</v-btn>
            <v-btn @click="handleReset">重置</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-data-table :headers="headers" :items="orders" :loading="loading" :items-per-page="pagination.itemsPerPage"
      :server-items-length="ordersCount" :page.sync="pagination.currentPage" @update:page="loadData">
      <template v-slot:items="props">
        <td>{{ props.item.order_number }}</td>
        <td>{{ props.item.product_id }}</td>
        <td>{{ props.item.order_status }}</td>
        <td>{{ props.item.order_time }}</td>

      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>
  
<script>
import { api } from '@/api';
import { readToken } from '@/store/main/getters';

export default {
  data() {
    return {
      menu: false,
      menu2: false,
      loading: false,
      orders: [],
      ordersCount: 0,
      headers: [
        { text: '订单ID', value: 'order_number' },
        { text: '商品ID', value: 'product_id' },
        { text: '商品状态', value: 'order_status' },
        { text: '创建时间', value: 'order_time' }
      ],
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
      },
      filters: {
        // 其他查询条件
        orderId: null,
        startDate: null,
        endDate: null,
      },
      dialog: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const params = {
          ...this.filters,
          page: this.pagination.currentPage,
          size: this.pagination.itemsPerPage,
          limit: this.pagination.itemsPerPage
        }
        console.log(params)
        const response = await api.getOrders(readToken(this.$store), params);
        if (response) {
          this.orders = response.data.items
          this.ordersCount = response.data.total_count
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    },
    async handleSearch() {
      try {
        const params = {
          ...this.filters,
          page: this.pagination.currentPage,
          size: this.pagination.itemsPerPage,
          limit: this.pagination.itemsPerPage
        }
        console.log(params)
        const response = await api.getOrders(readToken(this.$store), params);
        if (response) {
          this.orders = response.data.items
          this.ordersCount = response.data.total_count
        }
      } catch (error) {
        console.log(error)
      }


    },
    handleReset() {
      this.filters.startDate = null;
      this.filters.endDate = null;
      this.filters.orderId = '';
    },
    editItem(item) {
      this.editedIndex = this.orders.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.orders.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },


  }
};
</script>
  
<style></style>