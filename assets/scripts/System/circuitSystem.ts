import { _decorator, Component, Node } from 'cc';
import { ObjectController } from '../Object/ObjectController';
import { BatteryController } from '../Object/BatteryController';
import { Grid } from '../Components/Grid';
const { ccclass, property } = _decorator;



@ccclass('circuitSystem')
export class circuitSystem {


    circuitNode: number[] = [];

    batteryController: ObjectController = null;

    grid: Grid;

    dx: number[] = [0, 0, 1, -1];
    dy: number[] = [1, -1, 0, 0];

    circuit: number[][] = [];
    circuitUndir: number[][] = [];


    setBattery(battery: BatteryController) {
        this.batteryController = battery;
        this.grid = battery.grid;
    }

    buildGraph() {
        let vis = Array<number>(this.grid.width * this.grid.height);

        vis.fill(0);

        let startx = this.batteryController.gridPos.x;
        let starty = this.batteryController.gridPos.y;
        this.circuit = [];
        this.circuitUndir = [];
        this.circuitNode = [];
        this.circuitNode.push(this.grid.getGridMapIndex(startx, starty))
        vis[this.getMapindex(startx, starty)] = 1;
        let u = startx;
        let v = starty;

        let queue = new Array<number>();

        if (this.batteryController.rotationType == 0) {
            u++;
        } else {
            v--;
        }
        queue.push(this.getMapindex(u, v));

        while (queue.length > 0) {
            let u = this.grid.getGridpos(queue[0]).x;
            let v = this.grid.getGridpos(queue[0]).y;
            vis[this.getMapindex(u, v)] = 1;

            if (this.grid.getGridController(u, v).beNode) {
                this.circuitNode.push(this.getMapindex(u, v));
            }
            queue.shift();
            for (let i = 0; i < 4; i++) {
                let x = u + this.dx[i];
                let y = v + this.dy[i];
                if (vis[this.getMapindex(x, y)] == 0 && this.grid.isGridOccupy(x, y) == true) {
                    vis[this.getMapindex(x, y)] = 1;
                    queue.push(this.getMapindex(x, y));
                }
            }
        }

        let idxToGraph = new Map<number, number>();
        for (let i = 0; i < this.circuitNode.length; i++) {
            this.circuit.push([]);
            this.circuitUndir.push([]);
            idxToGraph.set(this.circuitNode[i], i);
        }
        
        for (let k = 0; k < this.circuitNode.length; k++){
            queue.push(this.circuitNode[k]);
            vis.fill(0);
            vis[idxToGraph.get(this.circuitNode[k])] = 1;
            while (queue.length > 0) {
                let u = this.grid.getGridpos(queue[0]).x;
                let v = this.grid.getGridpos(queue[0]).y;
                vis[this.getMapindex(u, v)] = 1;
                queue.shift();
                for (let i = 0; i < 4; i++) {
                    let x = u + this.dx[i];
                    let y = v + this.dy[i];
                    if (vis[this.getMapindex(x, y)] == 0 && this.grid.isGridOccupy(x, y) == true && idxToGraph.has(this.getMapindex(x, y)) == false) {
                        vis[this.getMapindex(x, y)] = 1;
                        queue.push(this.getMapindex(x, y));
                    }else if (idxToGraph.has(this.getMapindex(x, y)) == true && this.getMapindex(x, y) != this.circuitNode[k]){
                        this.circuitUndir[idxToGraph.get(this.circuitNode[k])].push(idxToGraph.get(this.getMapindex(x, y)))
                    }
                }
            }
        }

        for (let i = 0; i < this.circuitUndir.length; i++){
            for (let j = 0; j < this.circuitUndir[i].length; j++){
                console.log(i + " - > " + this.circuitUndir[i][j]);
            }
        }
    }

    getMapindex(_u: number, _v: number): number {
        return this.grid.getGridMapIndex(_u, _v);
    }

}


