<script>
export default {
    render(createElement) {
        return (
            <div onClick={this.tryClick} data-a="123">
                {this.list.map((item) => {
                    return (+item !== 2) && <div>{item}</div>
                })}
            </div>);
    },
    methods: {
        tryClick(e) {
            console.log(e);
            // console.log(this.name);
        }
    },
    data() {
        return {
            name: 'goku',
            list: ['' ,'1', '2', '3', '4', '5'],
        };
    },
}
</script>

<style>

</style>