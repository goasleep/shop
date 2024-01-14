

<template>
  <div>
    <v-form>
      <v-container>
        <v-row align="center">
          <v-col cols="3">
            <v-text-field v-model="filters.id" label="订单ID"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="filters.handle_person_id" label="操作人ID"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="filters.request_person_id" label="申请人ID"></v-text-field>
          </v-col>
          <v-col cols="3"><v-btn color="primary" @click="loadData">查询</v-btn></v-col>

        </v-row>
        <v-row align="center">
          <v-col cols="3">
            <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template v-slot:activator="{ on }">
                <v-text-field v-model="filters.created__ge" label="创建时间范围起始日期" prepend-icon="mdi-calendar" readonly
                  v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="filters.created__ge" @input="menu = false"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="3">
            <v-menu v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template v-slot:activator="{ on }">
                <v-text-field v-model="filters.created__le" label="创建时间范围结束日期" prepend-icon="mdi-calendar" readonly
                  v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="filters.created__le" @input="menu2 = false"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="filters.status" label="订单状态"></v-text-field>
          </v-col>
          <v-col cols="3"><v-btn @click="handleReset">重置</v-btn></v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-dialog v-model="dialog" persistent max-width="600px">
              <v-card>
                <v-card-title>
                  <span class="headline">修改状态</span>
                </v-card-title>
                <v-card-text>
                  <v-select
                    v-model="editedItem.status"
                    :items="items"
                    label="修改状态"
                  ></v-select>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="updateStatus">修改</v-btn>
                  <v-btn color="secondary" @click="closeDialog">取消</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-data-table :headers="headers" :items="orders" :options.sync="options" :server-items-length="ordersCount"
      :loading="loading" :footer-props="{
        showFirstLastPage: true,
        prevIcon: 'mdi-minus',
        nextIcon: 'mdi-plus'
      }" @update:item="saveItem">

      <template v-slot:item.commission_income="props">
        <v-edit-dialog :return-value.sync="props.item.commission_income" @save="save" @cancel="cancel" @open="open"
          @close="close">
          {{ props.item.commission_income }}
          <template v-slot:input>
            <v-text-field v-model="props.item.commission_income" label="Edit" single-line></v-text-field>
          </template>
        </v-edit-dialog>
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
      dialog: false,
      selectedFile: null,
      editedItem:{
        // 其他查询条件
        id: null,
        created__ge: null,
        created__le: null,
        handle_person_id: null,
        request_person_id: null,
        status: null,
      },
      orders: [],
      items: ['new', 'doing', 'finish'],
      ordersCount: 0,
      headers: [
        { text: '提现ID', value: 'id' },
        { text: '申请人ID', value: 'request_person_id' },
        { text: '处理人ID', value: 'handle_person_id' },
        { text: '提现账户', value: 'bank_account' },
        { text: '提现金额', value: 'amount' },
        { text: '创建时间', value: 'create_time' },
        { text: '状态', value: 'status' },
        { text: '操作', value: 'actions', sortable: false },
      ],
      options: {},
      filters: {
        // 其他查询条件
        id: null,
        created__ge: null,
        created__le: null,
        handle_person_id: null,
        request_person_id: null,
        status: null,
      },
      dialog: false
    };
  },
  created() {
    this.loadData();
  },
  watch: {
    options: {
      async handler() {
        await this.loadData()
      },
      deep: true,
    },
  },
  methods: {
    async loadData() {
      this.loading = true
      const { page, itemsPerPage } = this.options
      // const { created__ge, created__le } = this.filters


      const conditions = Object.entries(this.filters).reduce((acc, [key, value]) => {
        if (value !== null) {
          if (key === 'created__ge') {
            const createdDate = new Date(value);
            createdDate.setHours(0, 0, 0, 0); // 设置为当天的第一秒
            acc[key] = createdDate.toISOString();
          } else if (key === 'created__le') {
            const endedDate = new Date(value);
            endedDate.setHours(23, 59, 59, 999); // 设置为当天的最后一秒
            acc[key] = endedDate.toISOString();
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {});

      const params = {
        page,
        size: itemsPerPage,
        ...conditions,
      }
      console.log(params)
      const response = await api.getWithdraws(readToken(this.$store), params);
      if (response) {
        this.orders = response.data.items
        this.ordersCount = response.data.total_count
        this.loading = false
      }
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
        const response = await api.getWithdraws(readToken(this.$store), params);
        if (response) {
          this.orders = response.data.items
          this.ordersCount = response.data.total_count
        }
      } catch (error) {
        console.log(error)
      }

    },
    handleReset() {
      this.filters = Object.keys(this.filters).reduce((acc, key) => {
        acc[key] = null;
        return acc;
      }, {});
    },
    saveItem(item) {
      console.log(item)
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async updateStatus() {
      this.loading = true;
      const params = {
        status:this.editedItem.status
      }
      console.log(params)
      const response = await api.updateWithdraw(readToken(this.$store), this.editedItem.id, params);
      if (response) {
        this.orders = response.data.items
        this.ordersCount = response.data.total_count
        this.loading = false
      }
      
      this.closeDialog();
      this.loadData();
    },
    save() {
      console.log('save closed')
    },
    cancel() {

    },
    open() {

    },
    close() {
      console.log('Dialog closed')
    },

  }
};
</script>
  
<style></style>