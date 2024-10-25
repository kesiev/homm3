const
    LIMIT = 1024,
    path = require("path"),
    fs = require("fs"),
	terser = require("terser");

let data = fs.readFileSync(["..","playground","index.html"].join(path.sep), { encoding: "utf8", flag: "r" });
data = data.replace(/^[^]*function onl\(\) \{/,"").replace(/\}<\/script>[^]*/,"").trim();

terser.minify(data).then(minified=>{
    let
        minicode = minified.code.substr(0,minified.code.length-1),
        code="<canvas id=C><script>"+minicode+"</script>";
    
    let
        stats = {};

    minicode.replace(/([0-9]{2,})/g,(m,m1)=>{
        if (!stats[m1])
            stats[m1]=0;
        stats[m1]++;
    })
    minicode.replace(/([a-zA-Z]{2,})/g,(m,m1)=>{
        if (!stats[m1])
            stats[m1]=0;
        stats[m1]++;
    })

    console.log("Symbol stats:");
    console.log(stats);

    console.log(code.length+" bytes code. ("+(code.length-LIMIT)+" extra bytes)");
    console.log(minicode.length+" bytes JS. ("+(minicode.length-LIMIT)+" extra bytes)");
    fs.writeFileSync("packed.html", code);
})
