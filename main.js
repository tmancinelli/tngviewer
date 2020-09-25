//list of the artists and their PIDs 
const Artists = [
  { name: "Raphael", code: "001-03DN-0000" },
  { name: "Cimabue", code: "001-00SJ-0000" },
  { name: "Duccio", code: "001-0145-0000" },
  { name: "Giotto", code: "001-01IV-0000" },
  { name: "Michelangelo", code: "001-02JB-0000" },
];

class App {
  //list of artists in the navbar
  init() {
    const list = document.getElementById("artistsList");
    Artists.forEach(artist => {
      const a = document.createElement("a");
      a.setAttribute("class", "dropdown-item");
      a.setAttribute("href", "#");
      a.innerText = artist.name;
      a.onclick = () => this.load(artist.code, artist.name);
      list.appendChild(a);
    });

    this.load(Artists[0].code, Artists[0].name);
  }

//show the single artist
  async load(code, name) {
    const title = document.getElementById("title");
    title.innerText = name;

    //fetching the manifest
    const resp = await fetch("https://media.ng-london.org.uk/iiif/" + code + "/manifest.json");
    //parse as json
    const json = await resp.json();

    //Getting and showing the content of the label object
    const label = document.getElementById("label");
    label.innerText = json.label;
    
    this.populateImageList(code, name, json);
  }

  populateImageList(code, name, data) {
    if (!("sequences" in data)) {
      throw "No sequences in the manifest!"
    }
  
    if (data.sequences.length == 0) {
      throw "Manifest sequences is empty.";
    }
  
    if (!("canvases" in data.sequences[0])) {
      throw "No canvases in the manifest sequences"
    }
  
    const imageList = document.getElementById("imageList");
    while (imageList.firstChild) imageList.firstChild.remove();
    //create a card for each work
    data.sequences[0].canvases.forEach((canvas, id) => {
      const card = document.createElement("card");
      card.setAttribute("class", "card");
      card.setAttribute("style", "width: 18rem; margin-bottom: 4em");
      //getting images from manifest
      const image = document.createElement("img");
      image.setAttribute("src", canvas["images"][0]["resource"]["service"]["@id"] + "/full/200,/0/default.jpg");
      image.setAttribute("class", "card-img-top");
      card.appendChild(image);
      
      const body = document.createElement("div");
      body.setAttribute("class", "card-body");
      card.appendChild(body);

      const p = document.createElement("p");
      p.innerText = canvas['label'];
      body.append(p);
      //create a link for Mirador viewer
      const a = document.createElement("a");
      a.innerText = "View with Mirador";
      a.href = "#";
      a.onclick = () => this.showMirador(code, name, id);
      body.append(a);

      imageList.appendChild(card);
    });
  }

  showMirador(code, name, id) {
    $("#modalTitle").text(name);
    $("#modalDescription").text(label);
    $('#miradorModal').modal({})

    this.mirador = Mirador.viewer({
      id: 'mirador',
      windows: [
        {
           loadedManifest: "https://media.ng-london.org.uk/iiif/" + code + "/manifest.json",
           canvasIndex: id,
           thumbnailNavigationPosition: 'far-bottom'
        }
      ]
     });
  }
};

const app = new App();
app.init();
