<template>
    <div class="container1">
        <el-form :model="loginfrom" :rules="rules2" ref="loginfrom" label-position="left" label-width="0px" class="loginform">
            <h3 class="title">享趣斗牛后台管理</h3>
            <el-form-item prop="account">
                <el-input type="text" v-model="loginfrom.account" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input type="password" v-model="loginfrom.checkPass" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-checkbox v-model="checked"  class="remember">Remember Me</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button  style="width:100%;background-color: black;color: white" v-on:keyup.13.native="submit" @click.native.prevent="handleSubmit2" :loading="logining" >登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { requestLogin } from '@/api/api.js';
    export default {
        data() {
            return {
                logining: false,
                loginfrom: {
                    account: 'leilei',
                    checkPass: 'leilei'
                },
                rules2: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        //{ validator: validaePass }
                    ],
                    checkPass: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        //{ validator: validaePass2 }
                    ]
                },
                checked: false
            };
        },
        created() {
            var _this = this;
            document.onkeydown = function(e) {
                var key = window.event.keyCode;
                console.log(key)
                if (key == 13) {
                    _this.submit();
                }
            }
        },
        methods: {

            handleReset2() {
                this.$refs.loginfrom.resetFields();
            },
            submit(){
                this.handleSubmit2()
            },
            handleSubmit2(ev) {
                var _this = this;
                this.$refs.loginfrom.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        var loginParams = { username: this.loginfrom.account, password: this.loginfrom.checkPass };
                        //自己使用axios发送ajax请求
                        requestLogin(loginParams)
                            .then((res)=>{
                                console.debug(res)
                                this.logining = false;
                                let { message,content,head} = res.data;
                                if (!content) {
                                    this.$message({
                                        message: message,
                                        type: 'error'
                                    });
                                } else {
                                    sessionStorage.setItem('user', JSON.stringify(content));
                                    this.$router.push({ path: '/echarts' });
                                }
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
    .container1 {

        height:100%;width:100%;
        /*width: 100%;*/
        border: 1px solid black;
        position:fixed;
        background: url(../assets/bg2.png)100% 100%;text-align:center;

        .loginform {
            box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
            -moz-border-radius: 5px;
            background-clip: padding-box;
            margin: 14% auto;
            width: 350px;
            opacity: 0.95;
            top:50%;
            left:50%;
            padding: 35px 35px 15px 35px;
            //background: #fff;
            background-color: rgba(255, 255, 255, 0);
            border: 0px solid #eaeaea;
            box-shadow: 0 0 25px #cac6c6;
            .title {
                margin: 0px auto 40px auto;
                text-align: center;
                color: white;
            }
            .remember {
                margin: 0px 0px 35px 0px;
                float: left;
                color: white;
            }
        }
    }
</style>