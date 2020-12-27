let comp = [], packets = [], ticks = 0;

const init = () => {
    for (let i = 0; i < 50; i++) {
        comp[i] = new Computer();
        comp[i].load(input);
        comp[i].run([i]);
    }
}

const queuePacket = (rcptId, x, y) => {
    packets.push({
        rcptId: rcptId,
        x: x,
        y: y
    })
}

const readPackets = output => {
    let rcptIdPtr = 0;
    while (rcptIdPtr < output.length) {
        queuePacket(output[rcptIdPtr], output[rcptIdPtr+1], output[rcptIdPtr+2]);
        rcptIdPtr += 3;
    }
}

const fillQueue = () => {
    for (let i = 0; i < 50; i++) readPackets(comp[i].run([-1]).output);
}

const simulateNetwork = () => {
    let stop = false, nat = {}, natLastSentY;

    while (!stop) {
        fillQueue();

        while (packets.length > 0) {
            let packet = packets[0];
            if (comp[packet.rcptId]) {
                readPackets(comp[packet.rcptId].run([packet.x, packet.y]).output);
            } else {
                console.log('outer bound packet: address', packet.rcptId, '[x,y]', packet.x, packet.y);
                nat.x = packet.x; nat.y = packet.y;
            }
            packets.shift();
            ticks++;
        }

        if (packets.length == 0) {
            if (natLastSentY == nat.y) {
                console.log('NAT: we have a 2nd-time-sent Y value', nat);
                stop = true;
            } else {
                natLastSentY = nat.y;
                readPackets(comp[0].run([nat.x, nat.y]).output);
            }
        }
    }
}

init();
simulateNetwork();
