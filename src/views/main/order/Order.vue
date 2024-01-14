

<template>
  <div>
    <v-form>
      <v-container>
        <v-row align="center">
          <v-col cols="3">
            <v-text-field v-model="filters.order_number" label="订单ID"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="filters.commission_owner_id" label="推手ID"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="filters.product_id" label="商品ID"></v-text-field>
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
            <v-text-field v-model="filters.order_status" label="订单状态"></v-text-field>
          </v-col>
          <v-col cols="3"><v-btn @click="handleReset">重置</v-btn></v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-btn color="primary" @click="openDialog">点击上传文件</v-btn>
            <v-dialog v-model="dialog" persistent max-width="600px">
              <v-card>
                <v-card-title>
                  <span class="headline">上传文件</span>
                </v-card-title>
                <v-card-text>
                  <v-file-input v-model="selectedFile" label="选择文件"></v-file-input>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="uploadFile" :loading="uploadLoading">上传</v-btn>
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
        <v-icon small class="mr-2">
          mdi-pencil
        </v-icon>
        <!-- <v-icon small>
          mdi-delete
        </v-icon> -->
      </template>
    </v-data-table>
  </div>
</template>
  
<script>
import { api } from '@/api';
import { readToken } from '@/store/main/getters';
import lo from "lodash";

export default {
  data() {
    return {
      menu: false,
      menu2: false,
      loading: false,
      dialog: false,
      selectedFile: null,
      orders: [],
      ordersCount: 0,
      headers: [
        { text: '订单ID', value: 'order_number' },
        { text: '商品ID', value: 'product_id' },
        { text: '推手ID', value: 'commission_owner_id' },
        { text: '订单状态', value: 'order_status' },
        { text: '创建时间', value: 'order_time' },
        { text: '佣金金额', value: 'commission_income' },
        { text: '佣金比例', value: 'commission_rate' },
        { text: '结算状态', value: 'settlement_status' },
        { text: '操作', value: 'actions', sortable: false },
      ],
      options: {},
      filters: {
        // 其他查询条件
        order_number: null,
        created__ge: null,
        created__le: null,
        commission_owner_id: null,
        order_status: null,
      },
      dialog: false,
      uploadLoading: false
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
        limit: itemsPerPage,
        ...conditions,
      }

      const filteredObj = lo.pickBy(params, value => !lo.isEmpty(value));
      // console.log(params)
      const response = await api.getOrders(readToken(this.$store), params);
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
      this.filters = Object.keys(this.filters).reduce((acc, key) => {
        acc[key] = null;
        return acc;
      }, {});
    },
    saveItem(item) {
      console.log(item)
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
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async uploadFile() {
      // 处理文件上传逻辑
      // 可以使用 selectedFile 属性访问选中的文件
      // 这里可以调用上传文件的 API 或执行其他逻辑
      // 上传成功后，可以关闭弹窗
      this.uploadLoading = true;
      if (this.selectedFile) {
        // 创建 FormData 对象
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        const response = await api.uploadOrderFile(readToken(this.$store), formData);
        if (response) {
          console.log('上传成功');
        } else {
          console.log('上传失败');
        }
        // 发起 POST 请求，将文件上传到后端 API

      } else {
        console.log('请选择文件');
      }
      this.uploadLoading = false;
      this.dialog = false;
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