// lessons.js
// All lesson text lives here, plus the code that runs the step-by-step window
// (GIF on the left, explanation on the right).
//
// To change a lesson, edit the text below. To change a GIF, drop a file with the
// same name into assets/gifs/ (or change the "gif" name below).

const GIF_FOLDER = 'assets/gifs/';

export const LESSONS = {
    solar: {
        label: 'SUSTAINABLE ROOFTOP',
        title: 'Solar Panels',
        steps: [
            {
                title: 'Sunlight frees electrons inside the cell',
                gif: 'solar-1-sunlight.gif',
                gifIdea: 'Sun rays hitting a cell cross-section; a photon knocks an electron loose and leaves a glowing "hole".',
                alt: 'Sunlight hitting a silicon solar cell and freeing an electron',
                paragraphs: [
                    'Each solar cell is a thin slice of silicon made of two layers. The top layer is treated to have extra electrons (n-type). The bottom layer is treated to have gaps where electrons are missing, called holes (p-type). Where the layers meet, an electric field forms. This boundary is called the p-n junction.',
                    'Sunlight arrives as tiny packets of energy called photons. When a photon with enough energy hits the silicon, it knocks an electron free and leaves a hole behind. Photons with too little energy pass straight through, and photons with too much energy waste the extra as heat.'
                ],
                keyIdea: 'This is why a typical rooftop panel turns only about 20% of the sunlight that hits it into electricity.'
            },
            {
                title: 'The junction pushes the electrons into a current (DC)',
                gif: 'solar-2-current.gif',
                gifIdea: 'Electrons streaming along the thin metal lines of a panel, through a wire and back around in a loop.',
                alt: 'Electrons flowing through the grid lines of a solar panel as direct current',
                paragraphs: [
                    'The electric field at the junction pushes the freed electrons toward the top layer and the holes toward the bottom layer. The thin metal lines printed on the panel surface (the grid you can see) collect the electrons from the top.',
                    'Connect a wire from the top contact to the bottom contact and the electrons flow through it as direct current (DC), which moves in one direction only. One cell makes only about 0.5 volts, so a panel joins 60 or more cells in a chain (in series) to reach roughly 30 to 40 volts.'
                ],
                keyIdea: 'More light means more current. Heat lowers the voltage, and shade on part of the panel can cut its output sharply because the cells are chained together.'
            },
            {
                title: 'The inverter changes DC into AC',
                gif: 'solar-3-inverter.gif',
                gifIdea: 'A flat DC line entering a box and coming out as a smooth wave (AC); a small dial tracking the best point.',
                alt: 'An inverter turning a flat DC signal into a wavy AC signal',
                paragraphs: [
                    'Homes and the power grid use alternating current (AC), where the flow reverses direction. In India it swings back and forth 50 times every second (50 Hz) at 230 volts. The inverter turns the panel\u2019s DC into this AC using very fast electronic switches, then smooths the result into a clean wave.',
                    'Sunlight changes all day, so the inverter also does maximum power point tracking (MPPT). It keeps adjusting the electrical load so the panels work at the voltage that gives the most power right now. A grid-connected inverter also shuts itself off if the grid goes down, to protect workers repairing the lines.'
                ],
                keyIdea: 'The inverter converts DC to AC, finds the best operating point for the panels, and keeps the system safe.'
            },
            {
                title: 'The power is used, stored or shared',
                gif: 'solar-4-use.gif',
                gifIdea: 'Power flowing from the inverter into the building, with extra flowing to a battery or the grid; at night the arrows reverse.',
                alt: 'Solar power flowing to a building, a battery and the grid',
                paragraphs: [
                    'The AC power goes to the building\u2019s main distribution board, and appliances use the solar power first. If the panels make more than the building needs, the extra either charges a battery (in off-grid or hybrid systems) or flows out to the grid through a two-way meter (net metering, where your electricity provider allows it).',
                    'At night or on cloudy days, the building draws from the battery or the grid instead. As a rough guide, in sunny parts of India 1 kW of panels produces about 4 to 5 units (kWh) of electricity on a typical day.'
                ],
                keyIdea: 'Solar does not replace the grid at night. It reduces how much grid electricity you need during the day.'
            }
        ]
    },

    rain: {
        label: 'SUSTAINABLE ROOFTOP',
        title: 'Rainwater Harvesting',
        steps: [
            {
                title: 'The roof catches the rain (catchment)',
                gif: 'rain-1-catchment.gif',
                gifIdea: 'Raindrops landing on the roof and sliding toward the edges; a small counter showing litres collected.',
                alt: 'Rain falling on a roof and flowing toward its edges',
                paragraphs: [
                    'The roof is the catchment area. How much water you can collect depends on the roof area and the rainfall: 1 mm of rain falling on 1 square metre of roof gives about 1 litre of water.',
                    'You never collect all of it. Some is lost to splashing, evaporation and leaks, so a smooth concrete or tiled roof typically delivers about 80 to 90% of the rain that falls. A rough, dirty or porous roof delivers less. Example: a 100 m\u00b2 roof in a month with 200 mm of rain can give roughly 100 \u00d7 200 \u00d7 0.85 = 17,000 litres.'
                ],
                keyIdea: 'Water collected (litres) \u2248 roof area (m\u00b2) \u00d7 rainfall (mm) \u00d7 runoff factor (about 0.8 to 0.9).'
            },
            {
                title: 'Gutters and pipes carry it away (conveyance)',
                gif: 'rain-2-pipes.gif',
                gifIdea: 'Water running along the roof-edge pipes, around corners and toward the tank, with a mesh guard catching a leaf.',
                alt: 'Rainwater flowing along rooftop pipes toward a storage tank',
                paragraphs: [
                    'The roof slopes slightly toward its edges, so the water runs into gutters and pipes, like the pipes around the edge of this roof. Gravity does all the work, so no pump is needed at this stage.',
                    'Gutters and pipes must be sized for the heaviest downpour, not the average rain. If they are too small, water overflows and is lost. Mesh guards at the pipe openings stop leaves and bird droppings from getting in.'
                ],
                keyIdea: 'Design for the worst storm, not the average day.'
            },
            {
                title: 'The water is filtered and the first flush is thrown away',
                gif: 'rain-3-filter.gif',
                gifIdea: 'Dirty first water diverted to a side pipe, then clear water passing through layers of mesh, gravel and sand.',
                alt: 'A first-flush diverter and layered filter cleaning rainwater',
                paragraphs: [
                    'The first rain after a dry spell washes dust, bird droppings and leaves off the roof. A first-flush diverter sends this dirtiest water away instead of letting it into the tank.',
                    'After that, the water passes through a filter, usually mesh first and then layers of gravel and sand, sometimes with charcoal. The filter traps the remaining debris. The filter on the pipe in front of the tank here does this job.'
                ],
                keyIdea: 'Cleaning the water at the start is much cheaper than cleaning a dirty tank later.'
            },
            {
                title: 'The tank stores it, and the overflow recharges the ground',
                gif: 'rain-4-storage.gif',
                gifIdea: 'Water level rising in the tank; once full, the extra flows out of an overflow pipe into the soil.',
                alt: 'A rainwater tank filling up and overflowing into a recharge pit',
                paragraphs: [
                    'The filtered water flows into a closed, covered tank. The cover keeps out sunlight (so algae cannot grow), mosquitoes and dirt. The tank size is worked out from the roof area, the local rainfall and how much water you use.',
                    'When the tank is full, an overflow pipe sends the extra water to a recharge pit or soak well, where it seeps into the ground and refills groundwater. Stored water suits gardening, cleaning and flushing. To drink it, it must be treated first, for example filtered and disinfected.'
                ],
                keyIdea: 'Harvested rain does two jobs: it gives you water now and recharges groundwater for later.'
            }
        ]
    },

    // PASTE THIS inside LESSONS in lessons.js, right after the closing "}" of the
// `rain: { ... }` block. Add a comma after that "}" first, like:   rain: { ... },   plants: { ... }

    plants: {
        label: 'SUSTAINABLE ROOFTOP',
        title: 'IoT Smart Plants',
        steps: [
            {
                title: 'Sensors in the soil measure what the plant needs',
                gif: 'plants-1-sensors.gif',
                gifIdea: 'A probe pushed into soil; a gauge showing moisture dropping as the soil dries, with small icons for temperature and light.',
                alt: 'A soil moisture sensor measuring dryness in a plant pot',
                paragraphs: [
                    'Each planter has a small sensor probe in the soil (the thin stick with a blinking light). A capacitive soil moisture sensor works because wet soil and dry soil store electric charge differently. The sensor turns that difference into a voltage that tells us how wet the soil is.',
                    'Many setups add more sensors: air temperature and humidity, light level, and sometimes soil nutrients. Together they describe the plant\u2019s conditions far more reliably than a person glancing at the leaves.'
                ],
                keyIdea: 'IoT starts with sensing: the plant\u2019s conditions are turned into numbers a computer can use.'
            },
            {
                title: 'A small controller sends the data over Wi-Fi',
                gif: 'plants-2-network.gif',
                gifIdea: 'Sensor readings travelling as little packets to the hub box, then up to a cloud icon and a phone dashboard.',
                alt: 'Plant sensor data travelling through a hub to the cloud and a phone',
                paragraphs: [
                    'A tiny microcontroller (for example an ESP32) reads the sensors every few minutes. To save battery it sleeps in between readings. It sends the numbers wirelessly to the hub box, using Wi-Fi or a low-power radio, and a common message format for this is MQTT.',
                    'The hub forwards the data to the cloud, where it is stored and shown on a dashboard. You can see moisture history for every planter on a phone, and get an alert if something looks wrong.'
                ],
                keyIdea: 'Small devices collect the data; the network carries it to where people and software can use it.'
            },
            {
                title: 'Software decides, and water is delivered automatically',
                gif: 'plants-3-irrigation.gif',
                gifIdea: 'Moisture level dropping below a line, a valve opening, water flowing from the tank to the plant, then the valve closing as the level rises.',
                alt: 'An automatic valve watering a plant when the soil gets too dry',
                paragraphs: [
                    'The system compares each reading with a target range. If the soil is drier than the lower limit, it switches on a small pump or valve through a relay. When the soil reaches the upper limit, it switches off. Using two limits instead of one stops the valve from rapidly flicking on and off.',
                    'This is where the rooftop connects together: the water can come from the harvested rainwater tank, and the pump can run on the solar power. The right limits depend on the plant and soil, so they are tuned for each type.'
                ],
                keyIdea: 'Sense, send, decide, act: the loop waters plants only when they need it, which saves water.'
            }
        ]
    }
};

export function createLessons({ onOpen = () => {}, onClose = () => {} } = {}) {
    const root = document.getElementById('lesson');
    const el = {
        media: document.getElementById('lesson-media'),
        gif: document.getElementById('lesson-gif'),
        missing: document.getElementById('lesson-missing'),
        badge: document.getElementById('lesson-badge'),
        label: document.getElementById('lesson-label'),
        title: document.getElementById('lesson-title'),
        stepTitle: document.getElementById('lesson-step-title'),
        text: document.getElementById('lesson-text'),
        key: document.getElementById('lesson-key'),
        dots: document.getElementById('lesson-dots'),
        back: document.getElementById('lesson-back'),
        next: document.getElementById('lesson-next'),
        close: document.getElementById('lesson-close'),
        backdrop: document.getElementById('lesson-backdrop')
    };

    let lesson = null;
    let index = 0;
    let isOpen = false;

    // Show a friendly placeholder if a GIF file has not been added yet
    el.gif.addEventListener('error', () => el.media.classList.add('missing'));
    el.gif.addEventListener('load', () => el.media.classList.remove('missing'));

    function render() {
        const step = lesson.steps[index];
        const total = lesson.steps.length;

        el.label.textContent = lesson.label;
        el.title.textContent = lesson.title;
        el.badge.textContent = `Step ${index + 1} of ${total}`;
        el.stepTitle.textContent = step.title;

        el.text.replaceChildren(
            ...step.paragraphs.map((t) => {
                const p = document.createElement('p');
                p.textContent = t;
                return p;
            })
        );

        const strong = document.createElement('strong');
        strong.textContent = 'Key idea: ';
        el.key.replaceChildren(strong, document.createTextNode(step.keyIdea));

        // GIF (with placeholder text in case the file is missing)
        el.missing.innerHTML = '';
        const heading = document.createElement('strong');
        heading.textContent = 'GIF goes here';
        const code = document.createElement('code');
        code.textContent = GIF_FOLDER + step.gif;
        const idea = document.createElement('div');
        idea.textContent = 'Idea: ' + step.gifIdea;
        el.missing.append(heading, code, idea);

        el.media.classList.remove('missing');
        el.gif.alt = step.alt;
        el.gif.src = GIF_FOLDER + step.gif;

        el.dots.replaceChildren(
            ...lesson.steps.map((_, i) => {
                const dot = document.createElement('span');
                if (i === index) dot.className = 'active';
                return dot;
            })
        );

        el.back.disabled = index === 0;
        el.next.textContent = index === total - 1 ? 'Done \u2713' : 'Next \u2192';
    }

    function open(id) {
        if (!LESSONS[id]) return;
        lesson = LESSONS[id];
        index = 0;
        isOpen = true;
        render();
        root.classList.remove('hidden');
        el.next.focus();
        onOpen(id);
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        root.classList.add('hidden');
        if (document.activeElement) document.activeElement.blur();
        onClose();
    }

    function next() {
        if (index < lesson.steps.length - 1) {
            index += 1;
            render();
        } else {
            close();
        }
    }

    function back() {
        if (index > 0) {
            index -= 1;
            render();
        }
    }

    el.next.addEventListener('click', next);
    el.back.addEventListener('click', back);
    el.close.addEventListener('click', close);
    el.backdrop.addEventListener('click', close);

    window.addEventListener('keydown', (event) => {
        if (!isOpen) return;
        if (event.key === 'Escape') close();
        if (event.key === 'ArrowRight') next();
        if (event.key === 'ArrowLeft') back();
    });

    return { open, close, isOpen: () => isOpen };
}
