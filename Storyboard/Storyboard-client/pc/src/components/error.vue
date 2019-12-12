<template>
    <div class="error-page">
        <h1>{{code}}</h1>
    </div>
</template>

<script>
    export default {
        computed: {
            code(){
                return this.$route.params.code;
            }
        }
    }
</script>

<style lang="scss" scoped>
.error-page{
    margin-top: 5vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center
}
</style>