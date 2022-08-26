"use strict";
	
	const words1 = ["Acute", "Aft", "Anti-matter", "Bipolar", "Cargo", "Command", "Communication", "Computer", "Deuterium", "Dorsal", "Emergency", "Engineering", "Environmental", "Flight", "Fore", "Guidance", "Heat", "Impulse", "Increased", "Inertial", "Infinite", "Ionizing", "Isolinear", "Lateral", "Linear", "Matter", "Medical", "Navigational", "Optical", "Optimal", "Optional", "Personal", "Personnel", "Phased", "Reduced", "Science", "Ship's", "Shuttlecraft", "Structural", "Subspace", "Transporter", "Ventral"];
	
	const words2 = ["Propulsion", "Dissipation", "Sensor", "Improbability", "Buffer", "Graviton", "Replicator", "Matter", "Anti-matter", "Organic", "Power", "Silicon", "Holographic", "Transient", "Integrity", "Plasma", "Fusion", "Control", "Access", "Auto", "Destruct", "Isolinear", "Transwarp", "Energy", "Medical", "Environmental", "Coil", "Impulse", "Warp", "Phaser", "Operating", "Photon", "Deflector", "Integrity", "Control", "Bridge", "Dampening", "Display", "Beam", "Quantum", "Baseline", "Input"];
	
	const words3 = ["Chamber", "Interface", "Coil", "Polymer", "Biosphere", "Platform", "Thruster", "Deflector", "Replicator", "Tricorder", "Operation", "Array", "Matrix", "Grid", "Sensor", "Mode", "Panel", "Storage", "Conduit", "Pod", "Hatch", "Regulator", "Display", "Inverter", "Spectrum", "Generator", "Cloud", "Field", "Terminal", "Module", "Procedure", "System", "Diagnostic", "Device", "Beam", "Probe", "Bank", "Tie-In", "Facility", "Bay", "Indicator", "Cell"];
    
    // Proving number 4 on questions
    //words1.splice(1,0); // doesnt work
    //words1.push("foo"); // does work
    
    window.onload = initial;

    // Generate at start
    function initial() {
        babble(1);

        document.querySelector("#my-button").onclick = function(){babble(1)};
        document.querySelector("#five-button").addEventListener('click', function(){babble(5)});
    }
    
    // Generates Technobable from the three arrays, phrases represents an int value
    function babble (phrases) {

        let bab = "";
        function randomPhrase (array) {
           return array[Math.floor(Math.random() * array.length)];
        }
        
        
        //const bab += `${randomPhrase(words1)} ${randomPhrase(words2)} ${randomPhrase(words3)}`;
        for (let index = 0; index < phrases; index++) {
            bab += randomPhrase(words1) + " " + randomPhrase(words2) + " " + randomPhrase(words3) + "<br>";           
        }
        
        console.log(bab);

        // Update the text
        document.querySelector("#output").innerHTML = bab;
    }