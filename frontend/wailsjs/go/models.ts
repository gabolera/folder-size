export namespace foldersize {
	
	export class ItemInfo {
	    name: string;
	    path: string;
	    size: number;
	    sizeHuman: string;
	    fileCount: number;
	    folderCount: number;
	    // Go type: time
	    lastModified: any;
	    isHidden: boolean;
	    extension: string;
	    type: string;
	
	    static createFrom(source: any = {}) {
	        return new ItemInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	        this.size = source["size"];
	        this.sizeHuman = source["sizeHuman"];
	        this.fileCount = source["fileCount"];
	        this.folderCount = source["folderCount"];
	        this.lastModified = this.convertValues(source["lastModified"], null);
	        this.isHidden = source["isHidden"];
	        this.extension = source["extension"];
	        this.type = source["type"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

