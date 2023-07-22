function skillsMember() {
    var member = {
        name: "John Doe",
        age: 30,
        skills: ["HTML", "CSS", "JS"],
        address: {
            street: "Jl. Arnold Mononutu",
            city: "Minahasa Utara",
            province: "Sulawesi Utara",
            postCode: "95371"
        },
        sayHello: function () {
            console.log("Hello World");
        }
    };
    console.log(member.name);
    console.log(member.age);
    console.log(member.skills);
    console.log(member.address);
    console.log(member.address.city);
    console.log(member.address.province);
    console.log(member.address["postCode"]);
    member.sayHello();
}