const fs = require('fs');

// Load the original JSON file
let rawData = fs.readFileSync('original.json');
let data = JSON.parse(rawData);

// Create a mapping from tile symbols to GIDs
// The GID starts at 1 in Tiled
let tile_to_gid = {};
let gid = 1;
for (let tile in data['map']['palette']) {
  tile_to_gid[tile] = gid++;
}

// Prepare the output JSON data
let output_data = {
  height: data['map']['tiles'].length,
  layers: [],
  orientation: 'orthogonal',
  renderorder: 'right-down',
  tileheight: 32,
  tilesets: [
    {
      firstgid: 1,
      source: 'tileset.json',
    },
  ],
  tilewidth: 32,
  version: 1.2,
  width: data['map']['tiles'][0].length,
};

// Create a layer for the map
let layer = {
  data: [],
  height: output_data['height'],
  name: 'Layer 1',
  opacity: 1,
  type: 'tilelayer',
  visible: true,
  width: output_data['width'],
  x: 0,
  y: 0,
};

// Convert the map tiles to GIDs
for (let row of data['map']['tiles']) {
  for (let tile of row) {
    layer['data'].push(tile_to_gid[tile]);
  }
}

// Add the layer to the map
output_data['layers'].push(layer);

// Save the converted data as a new JSON file
let outputJSON = JSON.stringify(output_data, null, 4);
fs.writeFileSync('converted.json', outputJSON);
