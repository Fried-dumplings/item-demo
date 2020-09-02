<template>
    <div class="login">
        <div class="loginbox">
            <h2>登录</h2>
            <input type="text" v-model="from.username" placeholder="请输入用户名" />
            <br />
            <input type="password" v-model="from.password" placeholder="请输入密码" />
            <br />
            <input type="button" @click="login" value="登录" />
        </div>
    </div>
</template>


<script>
import { mapMutations } from "vuex";
export default {
    data() {
        return {
            from: {
                username: "",
                password: "",
            },
        };
    },

    methods: {
        ...mapMutations(["addUser"]),

        login() {
            // alert("登录成功");
            this.$http.post("/api/userlogin", this.from).then((res) => {
                console.log(res);
                if (res.code === 200) {
                    // console.log(111);

                    sessionStorage.setItem("token", JSON.stringify(res.list.token));
                    sessionStorage.setItem("user", JSON.stringify(res.list));

                    this.addUser();

                    this.$router.replace("/");

                } else {


                    this.$message.error("no");
                }
            });

            // if (this.from.user == 1 && this.from.pass == 1) {
            //     alert("登录成功");
            //     this.addUser(this.from);
            //     this.$router.push("/menu");
            // } else {
            //     alert("账号或密码错误");
            // }
        },
    },
};
</script>


<style lang="" scoped>
.login {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    background-image: linear-gradient(to right, #563443, #2f3d60);
}
.loginbox {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
h2 {
    color: white;
    margin-bottom: 15px;
}
input {
    box-sizing: border-box;
    margin-bottom: 15px;
    width: 300px;
    height: 40px;
    border: 0px solid;
    border-radius: 5px;
    outline: none;
}
input[type="text"],
input[type="password"] {
    padding-left: 10px;
    background-color: white;
}
input[type="button"] {
    border: none;
    color: white;
    background-color: #409eff;
    cursor: pointer;
}
</style>