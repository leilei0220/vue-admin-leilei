<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="20" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="admininfo.headimg" />  {{admininfo.u}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item divided @click.native="changePwd">修改密码</el-dropdown-item>
						<el-dropdown-item divided @click.native="handleEdit">修改信息</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>

							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)">
									<i :class="item.iconCls"></i>
								</div>
				           </li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
			<!--编辑的模态框 start-->
			<el-dialog title="修改管理用户信息" :visible.sync="dialogVisible" width="410px" @close="closeDialog"
					   :close-on-click-modal="false" :close-on-press-escape="false" >
				<el-form :model="editForm" status-icon :rules="editFormrules" ref="editForm" label-width="100px">
					<el-form-item label="账户:">
						<el-input type="text" v-model="editForm.username" auto-complete="off" size='small' :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="昵称:" prop="nickname">
						<el-input type="text" v-model="editForm.nickname" auto-complete="off" size='small'></el-input>
					</el-form-item>
					<el-form-item label="头像:">
						<div class="block"><el-avatar shape="square" :size="50" :src="editForm.headimg"></el-avatar></div>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false" size="small" style="margin-right: 60px;width: 80px"><span style="font-size: 14px">取消</span></el-button>
					  <el-button  :loading="loading" @click.native="editAdmin('editForm')"
								  size="small" style="margin-right: 80px;width: 80px;background-color: black;color: white"><span style="font-size: 14px">提交</span></el-button>
				  </span>
			</el-dialog>
			<!--编辑的模态框 end-->

			<!--密码编辑的模态框 start-->
			<el-dialog title="修改密码" :visible.sync="pwddialogVisible" width="410px"
					   :close-on-click-modal="false" :close-on-press-escape="false" >
				<el-form :model="pwdForm" status-icon :rules="pwdFormrules" ref="pwdForm" label-width="100px">
					<el-form-item label="原密码:"prop="oldpwd">
						<el-input type="password" v-model="pwdForm.oldpwd" auto-complete="off" size='small' ></el-input>
					</el-form-item>
					<el-form-item label="新密码:" prop="newpwd">
						<el-input type="password" v-model="pwdForm.newpwd" auto-complete="off" size='small'></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="pwddialogVisible = false" size="small" style="margin-right: 60px;width: 80px"><span style="font-size: 14px">取消</span></el-button>
					  <el-button  :loading="pwdloading" @click.native="editpwd('pwdForm')"
								  size="small" style="margin-right: 80px;width: 80px;background-color: black;color: white"><span style="font-size: 14px">提交</span></el-button>
				  </span>
			</el-dialog>
			<!--密码编辑的模态框 end-->
			<!--提示框-->
			<el-dialog
					title="密码修改提示"
					:visible.sync="centerDialogVisible"
					width="350px"
					center>
				<span style="margin-left: 60px">您的密码已被修改，请从新登陆</span>
				<span slot="footer" class="dialog-footer">
							<el-button @click="loginout3">取 消</el-button>
							<el-button type="primary" @click="loginout3">确 定</el-button>
						</span>
			</el-dialog>
	</el-row>
</template>

<script>
	import { EditAdmininfo,requestLogin,EditAdminPwd } from '@/api/api.js';
	export default {
		data() {
			return {
				sysName:'爱购网后台管理',
				collapsed:false,
				admininfo:{},
				editForm:{
					id:0,
					username:null,
					nickname:null,
					headimg:null,
				},
				pwdForm:{
					id:0,
					oldpwd:null,
					newpwd:null,
				},
				dialogVisible: false,
				pwddialogVisible: false,
				loading:false,
				pwdloading:false,
				centerDialogVisible:false,
				editFormrules: {
					nickname: [
						{required: true, message: '请输入昵称', trigger: 'blur'}
					],
				},
				pwdFormrules: {
					oldpwd: [
						{required: true, message: '请输入原密码', trigger: 'blur'}
					],
					newpwd: [
						{required: true, message: '请输入新密码', trigger: 'blur'}
					],
				},
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {
				});
			},

			handleEdit: function () {
				this.editForm.id = this.admininfo.id;
				this.editForm.username = this.admininfo.username;
				this.editForm.nickname = this.admininfo.nickname;
				this.editForm.headimg = this.admininfo.headimg;
				this.dialogVisible = true;
			},
			closeDialog() {
				this.dialogVisible = false;

			},

			changePwd(){
				this.pwdForm.id = this.admininfo.id;
				this.pwdForm.password = this.admininfo.password;
				this.pwddialogVisible = true;
			},
			//编辑管理员信息
			editAdmin(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true
						let {id,nickname,headimg} = this.editForm;
						EditAdmininfo(id,nickname,headimg).then((data) => {
							console.log(data)
							this.dialogVisible = false;
							this.loading = false;
							this.$message.success("操作成功");
							sessionStorage.setItem('user', JSON.stringify(data.data.content));
							this.initData();
						}).catch(() => {
							this.loading = false
							this.$message.error("操作失败");
						});
					}
				});
			},
			//修改密码
			editpwd(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.pwdloading = true
						let {id,oldpwd,newpwd} = this.pwdForm;
						EditAdminPwd(id,oldpwd,newpwd).then((data) => {
							if (data.data.head) {
								this.pwddialogVisible = false;
								this.pwdloading = false;
								this.$message.success(data.data.message);
								this.loginout2();
							}else{
								this.pwdloading = false
								this.$message.error(data.data.message);
							}
						}).catch(() => {
							this.pwdloading = false
							this.$message.error("操作失败");
						});
					}
				});
			},
			//点击退出登录（修改密码后）
			loginout2(){
				this.centerDialogVisible = true;
			},
			loginout3(){
				var _this = this;
				sessionStorage.removeItem('user');
				_this.$router.push('/login');
			},
			initData(){
				var user = sessionStorage.getItem('user');
				if (user) {
					user = JSON.parse(user);
					this.admininfo = user;
				}
			}
		},
		mounted() {
			this.initData();
			// var user = sessionStorage.getItem('user');
			// if (user) {
			// 	user = JSON.parse(user);
			// 	this.sysUserName = user.name || '';
			// 	this.sysUserAvatar = user.avatar || '';
			// }

		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>