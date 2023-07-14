import GenericAPI from "./generic";
import fetch from 'cross-fetch';
import type { Headers } from "../types/headers";
import type { MockupTask, Orientation } from "../types/mockup";

//------------------------------------------------------------------------------------------------------//
// XII. MOCKUP GENERATOR API
//------------------------------------------------------------------------------------------------------//
export default class MockupGeneratorAPI extends GenericAPI{
    constructor(headers: Headers, origin: string){super(headers, origin)}

    /**
     * Creates an asynchronous mockup generation task. Generation result can be retrieved using mockup generation task retrieval endpoint.
     * 
     * Rate limiting: Up to 10 requests per 60 seconds for established stores; 2 requests per 60 seconds for new stores. Currently available rate is returned in response headers. A 60 seconds lockout is applied if request count is exceeded. We also limit the number of files that may be generated to 20,000 files per account in a 24-hour period.
     * @param {int} id - Product ID. 
     * @param {MockupTask} mockup_task - Mockup Task Info 
     * 
     * @returns {promise} {task, error}
     */
    async createMockupTask(id: number, mockup_task: MockupTask){
        const url = this.origin+"/mockup-generator/create-task/"+id;
        const response = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(mockup_task)
        });
        const data = await response.json();
        const {result: task, code, error} = await data;
        if (code >= 400){
            return {task: null, error};
        }
        return {task, error: null}
    }

    /**
     * List of printfiles available for products variants. Printfile indicates what file resolution should be used to create a mockup or submit an order.
     * 
     * @param {number} id - Product ID. 
     * @param {string} orientation - Enum: "horizontal" "vertical", Optional orientation for wall art product printfiles. Allowed values: horizontal, vertical
     * @param {string} technique - Optional technique for product. This can be used in cases where product supports multiple techniques like DTG and embroidery
     * 
     * @returns {promise} {files, error}
     */
    async getProductVariantPrintFiles(id?: number, orientation?: Orientation, technique?: string){
        const params = new URLSearchParams({});
        orientation && params.append("orientation", orientation);
        technique && params.append("technique", technique);
        const url = this.origin + "/mockup-generator/printfiles/"+id+"?"+params.toString();
        const response = await fetch(url, {
            headers: this.headers,
        });
        const data = await response.json();
        const {result: files, code, error} = await data;
        if (code >= 400){
            return {files: null, error};
        }
        return {files, error: null}
    }

    async getMockupTaskResult(task_key: string){
        const params = new URLSearchParams({task_key});
        const url = this.origin + "/mockup-generator/task?"+params.toString();
        const response = await fetch(url, {
            headers: this.headers,
        });
        const data = await response.json();
        const {result: task, code, error} = await data;
        if (code >= 400){
            return {task: null, error};
        }
        return {task, error: null}
    }

    /**
     * Retrieve list of templates that can be used for client-side positioning.
     * 
     * @param {number} id - Product ID. 
     * @param {string} orientation - Enum: "horizontal" "vertical", Optional orientation for wall art product printfiles. Allowed values: horizontal, vertical
     * @param {string} technique - Optional technique for product. This can be used in cases where product supports multiple techniques like DTG and embroidery
     * 
     * @returns {promise} {files, error}
     */
    async getLayoutTemplates(id: number, orientation?: Orientation, technique?: string){
        const params = new URLSearchParams({});
        orientation && params.append("orientation", orientation);
        technique && params.append("technique", technique);
        const url = this.origin + "/mockup-generator/templates/"+id+"?"+params.toString();
        const response = await fetch(url, {
            headers: this.headers,
        });
        const data = await response.json();
        const {result: templates, code, error} = await data;
        if (code >= 400){
            return {templates: null, error};
        }
        return {templates, error: null}
    }
}