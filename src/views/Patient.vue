<template>
  <v-container id="regular-tables" fluid tag="section">
    <base-material-card
      color="success"
      icon="mdi-bookmark-plus"
      title="Hồ sơ"
      class="px-5 py-3"
    >
      <div class="patient">
        <h1>Hồ sơ bệnh nhân</h1>
        <div class="search">
          <v-text-field
            label="Tìm kiếm"
            placeholder="Nhập mã/tên bệnh nhân/mã bệnh án"
            color="secondary"
            hide-details
            v-model="search"
          >
            <template v-if="$vuetify.breakpoint.mdAndUp" v-slot:append-outer>
              <v-btn
                class="mt-n2"
                elevation="1"
                fab
                small
                @click="searchHandle"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </div>
        <div class="info">
          <v-simple-table fixed-header class="elevation-1" dark>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Mã bệnh nhân</th>
                  <th class="text-left">Họ tên</th>
                  <th class="text-left">Giới tính</th>
                  <th class="text-left">Ngày sinh</th>
                  <th class="text-left">Tuổi</th>
                  <th class="text-left">SĐT</th>
                  <th class="text-left">Địa chỉ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td v-for="item in info" :key="item.title">
                    {{ item.value }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
        <div class="details">
          <v-row>
            <v-col cols="6">
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
                    <!-- <v-dialog v-model="dialog" max-width="500px">
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
                                <v-text-field
                                  v-model="editedItem.name"
                                  label="Ngôn ngữ"
                                />
                              </v-col>
                              <v-col cols="12">
                                <v-text-field
                                  v-model="editedItem.note"
                                  label="Mô tả"
                                />
                              </v-col>
                            </v-row>
                            <v-alert
                              type="warning"
                              dense
                              border="left"
                              v-if="error"
                            >
                              {{ error }}
                            </v-alert>
                          </v-container>
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer />
                          <v-btn color="blue darken-1" text @click="close">
                            Hủy
                          </v-btn>
                          <v-btn color="blue darken-1" text @click="save">
                            Lưu
                          </v-btn>
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
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="closeDelete"
                          >
                            Hủy
                          </v-btn>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="deleteItemConfirm"
                          >
                            Xóa
                          </v-btn>
                          <v-spacer />
                        </v-card-actions>
                      </v-card>
                    </v-dialog> -->
                  </v-toolbar>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <!-- <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
                  <v-icon small @click="detailHandel(item)"> mdi-eye </v-icon>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="6">
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

                    <v-row justify="center">
                      <v-dialog
                        v-model="dialog"
                        fullscreen
                        hide-overlay
                        transition="dialog-bottom-transition"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn color="primary" dark v-bind="attrs" v-on="on">
                            Open Dialog
                          </v-btn>
                        </template>
                        <v-card>
                          <v-toolbar dark color="primary">
                            <v-btn icon dark @click="dialog = false">
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-toolbar-title>Settings</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                              <v-btn dark text @click="dialog = false">
                                Save
                              </v-btn>
                            </v-toolbar-items>
                          </v-toolbar>
                          <v-list three-line subheader>
                            <v-subheader>User Controls</v-subheader>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title
                                  >Content filtering</v-list-item-title
                                >
                                <v-list-item-subtitle
                                  >Set the content filtering level to restrict
                                  apps that can be
                                  downloaded</v-list-item-subtitle
                                >
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>Password</v-list-item-title>
                                <v-list-item-subtitle
                                  >Require password for purchase or use password
                                  to restrict purchase</v-list-item-subtitle
                                >
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                          <v-divider></v-divider>
                          <v-list three-line subheader>
                            <v-subheader>General</v-subheader>
                            <v-list-item>
                              <v-list-item-action>
                                <v-checkbox
                                  v-model="notifications"
                                ></v-checkbox>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title
                                  >Notifications</v-list-item-title
                                >
                                <v-list-item-subtitle
                                  >Notify me about updates to apps or games that
                                  I downloaded</v-list-item-subtitle
                                >
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-action>
                                <v-checkbox v-model="sound"></v-checkbox>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title>Sound</v-list-item-title>
                                <v-list-item-subtitle
                                  >Auto-update apps at any time. Data charges
                                  may apply</v-list-item-subtitle
                                >
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-action>
                                <v-checkbox v-model="widgets"></v-checkbox>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title
                                  >Auto-add widgets</v-list-item-title
                                >
                                <v-list-item-subtitle
                                  >Automatically add home screen
                                  widgets</v-list-item-subtitle
                                >
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-card>
                      </v-dialog>
                    </v-row>
                  </v-toolbar>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <!-- <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
                  <v-icon small @click="detailHandle(item)"> mdi-eye </v-icon>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </div>
      </div>
    </base-material-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      info: [
        {
          title: "Mã bệnh nhân",
          value: "119292",
        },
        {
          title: "Họ và tên",
          value: "Nguyễn Thị Thơ Mộng Như Mơ",
        },
        {
          title: "Giới tính",
          value: "Nữ",
        },
        {
          title: "Ngày sinh",
          value: "12/12/1998",
        },
        {
          title: "Tuổi",
          value: "22",
        },
        {
          title: "Số điện thoại",
          value: "0889678998",
        },
        {
          title: "Địa chỉ",
          value: "Nam Từ Liêm, Hà Nội",
        },
      ],
      search: "",
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: "Ngày đăng ký",
          align: "start",
          value: "start_date",
        },
        { text: "Mã đợt khám", value: "code" },
        { text: "Ngày kết thúc", value: "end_date" },
        { text: "Đối tượng", value: "object" },
        { text: "Chi tiết", value: "actions" },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        note: "",
      },
      defaultItem: {
        name: "",
        note: "",
      },
      notifications: false,
      sound: true,
      widgets: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    searchHandle() {
      if (this.search) {
        this.info = [
          {
            title: "Mã bệnh nhân",
            value: this.search,
          },
          {
            title: "Họ và tên",
            value: "Nguyễn Thị Thơ Mộng Như Mơ",
          },
          {
            title: "Giới tính",
            value: "Nữ",
          },
          {
            title: "Ngày sinh",
            value: "12/12/1998",
          },
          {
            title: "Tuổi",
            value: "22",
          },
          {
            title: "Số điện thoại",
            value: "0889678998",
          },
          {
            title: "Địa chỉ",
            value: "Nam Từ Liêm, Hà Nội",
          },
        ];
      }
    },
    getList() {
      this.desserts = [
        {
          start_date: "12/12/2020",
          code: "119929",
          end_date: "24/14/2020",
          object: "BHYT",
        },
      ];
    },
    detailHandle() {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
  },
};
</script>

<style>
.patient h1 {
  text-align: center;
  text-transform: uppercase;
  color: #222;
}
.patient .search {
  width: 400px;
  margin: 0 auto;
  display: flex;
}
.patient .search button {
  margin-right: 0 !important;
}
.patient .info tr {
  pointer-events: none;
}
.patient .info th {
  font-weight: 600;
  color: #222 !important;
}
.patient .info {
  margin: 30px 0;
}
</style>