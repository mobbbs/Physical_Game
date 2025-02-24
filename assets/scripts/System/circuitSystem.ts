import { _decorator, Component, Node, Pool } from 'cc';
import { ObjectController } from '../Object/ObjectController';
import { BatteryController } from '../Object/BatteryController';
import { Grid } from '../Components/Grid';
import { SwitchController } from '../Object/SwitchController';
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
    circuitdir : number[][] = [];

    circuitController : ObjectController[] = [];

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
        this.circuitdir = [];
        this.circuitNode = [];
        this.circuitController = [];
        let Rsum = []; // 关于一个元件串联的电阻和。
        this.circuitNode.push(this.grid.getGridMapIndex(startx, starty))
        this.circuitController.push(this.grid.getGridController(startx, starty));
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
                this.circuitController.push(this.grid.getGridController(u, v));
            }
            if (this.grid.getGridController(u, v).data.id == 3) {
                (this.grid.getGridController(u, v) as SwitchController).setBattery(this.circuitController[0] as BatteryController);
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
            this.circuitdir.push([]);
            Rsum.push(this.circuitController[i].data.resistance);
            idxToGraph.set(this.circuitNode[i], i);
            console.log(this.circuitController[i]);
            this.circuitController[i].initEle();
        }
        
        for (let k = 0; k < this.circuitNode.length; k++){
            if (k == 0){
                queue.push(this.circuitNode[k]);
                vis.fill(0);
                vis[idxToGraph.get(this.circuitNode[k])] = 1;
                while (queue.length > 0) {
                    let u = this.grid.getGridpos(queue[0]).x;
                    let v = this.grid.getGridpos(queue[0]).y;
                    vis[this.getMapindex(u, v)] = 1;
                    queue.shift();
                    if (u == this.circuitController[0].gridPos.x && v == this.circuitController[0].gridPos.y){
                        let i = (this.circuitController[0].Type == 0 ? 2 : 1);
                        // console.log(u + " , " + v);  
                        // console.log(this.circuitController[0].Type);
                        let x = u + this.dx[i];
                        let y = v + this.dy[i];
                        // console.log(x + " , " + y);
                        // console.log(vis[this.getMapindex(x, y)] + " " + this.grid.isGridOccupy(x, y) + " " + idxToGraph.has(this.getMapindex(x, y)));
                        if (vis[this.getMapindex(x, y)] == 0 && this.grid.isGridOccupy(x, y) == true && idxToGraph.has(this.getMapindex(x, y)) == false) {
                            vis[this.getMapindex(x, y)] = 1;
                            queue.push(this.getMapindex(x, y));
                            // console.log("FUFUUU");
                        }else if (idxToGraph.has(this.getMapindex(x, y)) == true && this.getMapindex(x, y) != this.circuitNode[k]){
                            // console.log("SBSBS");
                            this.circuitUndir[idxToGraph.get(this.circuitNode[k])].push(idxToGraph.get(this.getMapindex(x, y)))
                        }
                    }else{
                        for (let i = 0; i < 4; i++){
                            // let i = (this.circuitController[0].Type == 0 ? 0 : 3);
                            // console.log(this.circuitController[0].Type);
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
            }else{
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
        }

        // this.circuitUndir[0].splice(this.circuitUndir[0].indexOf(this.circuitUndir.length - 1), 1);
        //  this.circuitUndir[this.circuitUndir.length - 1].splice(this.circuitUndir[this.circuitUndir.length - 1].indexOf(0), 1);
            for (let i = 0; i < this.circuitUndir.length; i++){
                for (let j = 0; j < this.circuitUndir[i].length; j++){
                    console.log(i + " - > " + this.circuitUndir[i][j]);
                }
            }
        // 已经去除了最后一个节点与电源节点的边
        // 下面考虑将无向边建立为有向边，考虑点权，考虑拓扑序。 ！！！这是错的，拓扑序无法知晓电流流向
        // 下考虑基尔霍夫定律，仅考虑使用节点以及元件建立图。
        // 仅需考虑 对于一个节点是否存在可以直接到达另一个节点不通过用电器。
        let size = this.circuitUndir.length;
        vis.fill(0);
        queue.push(0);
        
        vis[size - 1] = 1;


        while (queue.length > 0){
            let x = queue[0];
            queue.shift();
            for (let i = 0; i < this.circuitUndir[x].length; i++){
                let y = this.circuitUndir[x][i];
                if (vis[y]) {
                    continue;
                }
                if (this.circuitController[y].data.name != "wire"){
                    Rsum[y] += Rsum[x];
                }else{
                    Rsum[y] = 0;
                }
                vis[y] = 1;
                queue.push(y);
            }
        }

        vis.fill(0);

        queue.push(0);


        while (queue.length > 0){
            let x = queue[0];
            // console.log(x);
            queue.shift();
            // if (this.circuitController[x].data.name == "wire"){
            //     this.circuitController[x].setEle(true);
            // }
            if (this.circuitController[x].canCross == false){
                this.circuitController[x].setEle(0);
            }
            let haveZero = false;
            for (let i = 0; i < this.circuitUndir[x].length; i++){
                let y = this.circuitUndir[x][i];
                if (vis[y]){
                    continue;
                }
                if (this.circuitController[y].equleWire){
                    haveZero = true;
                }
            }
            if (haveZero){
                for (let i = 0; i < this.circuitUndir[x].length; i++){
                    let y = this.circuitUndir[x][i];
                    if (vis[y]){
                        continue;
                    }
                    if (this.circuitController[y].equleWire){
                        queue.push(y);    
                        this.circuitController[y].setEle((this.circuitController[y].Onele | (this.circuitController[x].Onele)));
                        vis[y] = 1;
                    }else{
                        queue.push(y);    
                        this.circuitController[y].setEle(0);
                        vis[y] = 1;
                    }
                }   
            }else{
                for (let i = 0; i < this.circuitUndir[x].length; i++){
                    let y = this.circuitUndir[x][i];
                    if (vis[y]){
                        continue;
                    }
                    this.circuitController[y].setEle((this.circuitController[y].Onele | (this.circuitController[x].Onele)));
                    queue.push(y);
                    vis[y] = 1;
                }
            }
        }
        // this.circuitController[0].Onele = true;
        // 保证电池恒通电   
    }

    getMapindex(_u: number, _v: number): number {
        return this.grid.getGridMapIndex(_u, _v);
    }

}


