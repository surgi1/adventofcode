let comp = Array.from({length:50}, (v, i) => new Computer().load(input).run([i]).self),
    packets = [];

const readPackets = output => {
    while (output.length) packets.push({
        rcptId: output.shift(),
        x: output.shift(),
        y: output.shift()
    })
}

const simulateNetwork = (nat = {}, natLastSentY) => {
    while (true) {
        comp.forEach(c => readPackets(c.run([-1]).output))

        while (packets.length) {
            let packet = packets.shift();
            if (comp[packet.rcptId]) {
                readPackets(comp[packet.rcptId].run([packet.x, packet.y]).output);
            } else {
                console.log('outer bound packet: address', packet.rcptId, '[x,y]', packet.x, packet.y);
                nat.x = packet.x; nat.y = packet.y;
            }
        }

        if (natLastSentY == nat.y) {
            console.log('NAT: we have a 2nd-time-sent Y value', nat);
            break;
        } else {
            natLastSentY = nat.y;
            readPackets(comp[0].run([nat.x, nat.y]).output);
        }
    }
}

simulateNetwork();