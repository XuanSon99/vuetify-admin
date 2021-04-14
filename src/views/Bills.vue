<template>
  <v-container id="regular-tables" fluid tag="section">
    <base-material-card
      color="success"
      icon="mdi-calendar-text"
      title="Phiếu mượn"
      class="px-5 py-3"
    >
      <!-- update: sort-desc -->
      <v-data-table
        :headers="headers"
        :items="desserts"
        class="elevation-1"
        :search="search"
        dark
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
            <v-spacer />
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }" v-if="$level">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Thêm mới
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-autocomplete
                          :items="readerList"
                          v-model="editedItem.reader"
                          label="Sinh viên"
                          item-text="name"
                          item-value="student_code"
                          return-object
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          :items="docList"
                          v-model="editedItem.document"
                          label="Tài liệu"
                          :item-text="
                            (item) => item.name + ' - ' + item.still_amount
                          "
                          item-value="id"
                          return-object
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.amount"
                          label="Số lượng"
                          type="number"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.lender"
                          label="Người cho mượn"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.borrow_time"
                          label="Ngày mượn"
                          placeholder="12/04/1999"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.return_time"
                          label="Ngày trả"
                          placeholder="12/04/1999"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          :items="statusList"
                          v-model="editedItem.status"
                          label="Trạng thái"
                          item-text="name"
                          item-value="code"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-alert type="warning" dense border="left" v-if="error">
                      {{ error }}
                    </v-alert>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer />
                  <v-btn color="blue darken-1" text @click="close"> Hủy </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Lưu </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">
                  Bạn có chắc chắn muốn xóa?
                </v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="blue darken-1" text @click="closeDelete">
                    Hủy
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                    Xóa
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Mã phiếu",
        align: "start",
        value: "id",
      },
      { text: "Tên sách", value: "document.name" },
      { text: "Sinh viên", value: "reader.name" },
      { text: "MSV", value: "reader.student_code" },
      { text: "Số lượng mượn", value: "amount" },
      { text: "Người cho", value: "lender" },
      { text: "Ngày mượn", value: "borrow_time" },
      { text: "Ngày trả", value: "return_time" },
      { text: "Trạng thái", value: "statusName" },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      reader: "",
      document: "",
      lender: "",
      borrow_time: "",
      return_time: "",
      status: "",
      amount: "",
    },
    defaultItem: {
      reader: "",
      document: "",
      lender: "",
      borrow_time: "",
      return_time: "",
      status: "",
      amount: "",
    },
    error: "",
    statusList: [
      {
        name: "Đã trả",
        code: "ok",
      },
      {
        name: "Chưa trả",
        code: "not",
      },
    ],
    readerList: [],
    docList: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Thêm mới" : "Sửa";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    this.getList();
    this.CallAPI("get", "readers", {}, (response) => {
      this.readerList = response.data;
    });
    this.getDocs();
    if (this.$level) {
      this.headers.push({
        text: "Hành động",
        value: "actions",
        sortable: false,
      });
    }
  },

  methods: {
    getDocs() {
      this.CallAPI("get", "documents", {}, (response) => {
        for (let item of response.data) {
          if (item.still_amount > 0) {
            this.docList.push({
              id: item.id,
              still_amount: item.still_amount,
              name: item.name,
            });
          }
        }
      });
    },
    getList() {
      this.desserts = [];
      this.CallAPI("get", "bills", {}, (response) => {
        for (let item of response.data) {
          this.desserts.push({
            id: item.id,
            reader: item.reader,
            document: item.document,
            lender: item.lender,
            borrow_time: this.formatDate(item.borrow_time),
            return_time: this.formatDate(item.return_time),
            status: item.status,
            statusName: item.status == "ok" ? "Đã trả" : "Chưa trả",
            amount: item.amount,
          });
        }
      });
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-GB");
    },

    formatDate2(date) {
      return date.split("/").reverse().join("-");
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.closeDelete();
      this.CallAPI(
        "delete",
        "bills/" + this.desserts[this.editedIndex].id,
        {},
        (response) => {
          this.$toast.success("Xóa thành công");
          this.getList();
        },
        (error) => {
          console.log(error.response.data);
        }
      );
    },

    close() {
      this.error = "";
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    random(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    },

    save() {
      // for (let i = 1; i < 23; i++) {
      //   let a = this.random(0, 1);
      //   this.CallAPI(
      //     "post",
      //     "bills",
      //     {
      //       student_id: "2017211119",
      //       document_id: this.random(67, 76),
      //       amount: this.random(1, 52),
      //       lender: "Nguyễn Xuân Sơn",
      //       borrow_time:
      //         "2020" + "-" + this.random(1, 6) + "-" + this.random(1, 28),
      //       return_time:
      //         "2020" + "-" + this.random(7, 12) + "-" + this.random(1, 28),
      //       status: a == 0 ? "ok" : "not",
      //     },
      //     (response) => {
      //       // this.$toast.success("Thêm thành công");
      //       // this.getList();
      //       // this.close();
      //     },
      //     (error) => {
      //       this.error = "Mã tác giả đã tồn tại";
      //     }
      //   );
      // }
      // return;
      let data = {
        student_id: this.editedItem.reader.student_code,
        document_id: this.editedItem.document.id,
        amount: this.editedItem.amount,
        lender: this.editedItem.lender,
        borrow_time: this.formatDate2(this.editedItem.borrow_time),
        return_time: this.formatDate2(this.editedItem.return_time),
        status: this.editedItem.status,
      };
      if (
        !data.student_id ||
        !data.document_id ||
        !data.amount ||
        !data.lender ||
        !data.borrow_time ||
        !data.return_time ||
        !data.status
      ) {
        this.error = "Vui lòng nhập đủ thông tin";
        return;
      }
      if (data.amount > this.editedItem.document.still_amount) {
        this.error = "Số lượng sách còn lại không đủ";
        return;
      }
      if (
        !this.validDate(this.editedItem.borrow_time) ||
        !this.validDate(this.editedItem.return_time)
      ) {
        this.error = "Ngày không đúng";
        return;
      }
      if (this.editedIndex > -1) {
        this.CallAPI(
          "put",
          "bills/" + this.desserts[this.editedIndex].id,
          data,
          (response) => {
            this.$toast.success("Sửa thành công");
            this.getList();
            this.close();
          },
          (error) => {
            console.log(error.response.data);
          }
        );
      } else {
        this.CallAPI(
          "post",
          "bills",
          data,
          (response) => {
            this.$toast.success("Thêm thành công");
            this.getList();
            this.close();
          },
          (error) => {
            this.error = "Mã tác giả đã tồn tại";
          }
        );
      }
    },
    validDate(date) {
      const reg = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
      return reg.test(date);
    },
  },
};
</script>
