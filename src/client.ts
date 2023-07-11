import fetch from 'cross-fetch';
import OAuth from './lib/oauth';
import Catalog from './lib/catalog';
import type { Headers } from './types/headers';
import type { SyncProduct, OptionalSyncProduct } from './types/product'
import type { SyncVariant, OptionalSyncVariant } from './types/variant';
import type { NewOrder, OrderStatus } from './types/order';


export class PrintfulAcountClient{
    protected origin = "https://api.printful.com";
    protected headers: Headers;
    public oauth: OAuth;
    public catalog: Catalog;

    constructor(auth: string | undefined){
        this.headers = {Authorization: "Bearer " + (auth || "")};
        this.oauth = new OAuth(this.headers, this.origin);
        this.catalog = new Catalog(this.headers, this.origin);
    }

//------------------------------------------------------------------------------------------------------//
// III. PRODUCTS API
//------------------------------------------------------------------------------------------------------//

    /**
     * Returns a list of Sync Product objects from your custom Printful store.
     * 
     * Params:
     * @param {int} [offset=0] - Offset for Paging
     * @param {int} [limit=20] - Limit items for Paging
     * ----------------------------------------------------------------
     * Optional Params:
     * @param {string} [category_id] - (Optional) A comma-separated list of Category IDs of the Products that are to be returned
     * 
     * @returns {promise} {products, paging, error}
     */
    async getSyncProducts(offset=0, limit=20, category_id=""){
        const url = this.origin+"/store/products?"+"offset="+offset+"&limit="+limit+(category_id ? "&category_id="+category_id : "");
        const response = await fetch(url, {headers:this.headers});
        const data = await response.json();
        const {result: products, paging, code, error} = await data;
        if (code >= 400){
            return {products: [], paging: {offset,limit}, error};
        }
        return {products, paging, error: {}}
    }

    /**
     * Creates a new Sync Product together with its Sync Variants. See Examples: {@link https://developers.printful.com/docs/?_gl=1*1sbmfdi*_ga*NDMzMTM2Mjk0LjE2ODcyMzU3MDc.*_ga_EZ4XVRL864*MTY4ODc3OTM1NC4xMi4xLjE2ODg3ODEwMzYuMTAuMC4w#section/Products-API-examples/Create-a-new-Sync-Product Link}
     * 
     * Params:
     * @param {SyncProduct} sync_product - Information about the SyncProduct
     * @param {Array<SyncVariant>} sync_variants - Information about the Sync Variants
     * 
     * @returns {promise} {product, error}
     */
    async createSyncProduct(sync_product: SyncProduct, sync_variants: Array<SyncVariant>){
        const url = this.origin+"/store/products";
        const response = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({sync_product, sync_variants})
        });
        const data = await response.json();
        const {result: product, code, error} = await data;
        if (code >= 400){
            return {product: {}, error};
        }
        return {product, error: {}};
    }

    /**
     * Get information about a single Sync Product and its Sync Variants.
     * @param {int|string} id - Sync Product ID (integer) or External ID (if prefixed with `@`)
     * 
     * @returns {promise} {sync_product, sync_variants, error}
     */
    async getSyncProduct(id: number | string){
        const url = this.origin+"/store/products/"+id;
        const response = await fetch(url, {headers:this.headers});
        const data = await response.json();
        const {result, code, error} = await data;
        if (code >= 400){
            return {sync_product: {}, sync_variants: [], error};
        }
        const {sync_product, sync_variants} = await result;
        // console.log(sync_product, sync_variants);
        return {sync_product, sync_variants, error: {}};
    }

    /**
     * Deletes a Sync Product with all of its Sync Variants
     * @param {int|string} id - Sync Product ID (integer) or External ID (if prefixed with `@`)
     * 
     * @returns {promise} {sync_product, sync_variants, error}
     */
    async deleteSyncProduct(id: number | string){
        const url = this.origin+"/store/products/"+id;
        const response = await fetch(url, {
            method: "DELETE",
            headers:this.headers
        });
        const data = await response.json();
        const {result, code, error} = await data;
        if (code >= 400){
            return {result: [], error};
        }
        return {result, error: {}};
    }

    /**
     * Modifies an existing Sync Product with its Sync Variants.

        Please note that in the request body you only need to specify the fields that need to be changed. Furthermore, if you want to update existing sync variants, then in the sync variants array you must specify the IDs of all existing sync variants. All omitted existing sync variants will be deleted. All new sync variants without an ID will be created. See examples for more insights.
        {@link https://developers.printful.com/docs/?_gl=1*1sbmfdi*_ga*NDMzMTM2Mjk0LjE2ODcyMzU3MDc.*_ga_EZ4XVRL864*MTY4ODc3OTM1NC4xMi4xLjE2ODg3ODEwMzYuMTAuMC4w#section/Products-API-examples/Modify-a-Sync-Product See Examples}
        Rate limiting: Up to 10 requests per 60 seconds. A 60 seconds lockout is applied if request count is exceeded.
     * @param {int|string} id - Sync Product ID (integer) or External ID (if prefixed with `@`)
     * @param {OptionalSyncProduct} sync_product - Information about the SyncProduct
     * @param {Array<OptionalSyncVariant>} sync_variants - Information about the Sync Variants
     * 
     * @returns {promise} {product, error}
     */
    async modifySyncProduct(id: number | string, sync_product: OptionalSyncProduct, sync_variants: Array<OptionalSyncVariant>){
        const url = this.origin+"/store/products/"+id;
        const response = await fetch(url, {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify({sync_product, sync_variants})
        });
        const data = await response.json();
        const {result: product, code, error} = await data;
        if (code >= 400){
            return {product: {}, error};
        }
        return {product, error: {}};
    }

    /**
     * Get information about a single Sync Variant.

     * @param {int|string} id -  Sync Variant ID (integer) or External ID (if prefixed with `@`)
     *
     * @returns {promise} {variant, error}
     */
    async getSyncVariant(id: number | string){
        const url = this.origin+"/store/variants/"+id;
        const response = await fetch(url, {headers: this.headers});
        const data = await response.json();
        const {result: variant, code, error} = await data;
        if (code >= 400){
            return {variant: {}, error};
        }
        return {variant, error: {}};
    }

    /**
     * Deletes a single Sync Variant.
     * 
     * @param {int|string} id - Sync Variant ID (integer) or External ID (if prefixed with `@`)
     * 
     * @returns {promise} {result, error}
     */
    async deleteSyncVariant(id: number | string){
        const url = this.origin+"/store/variants/"+id;
        const response = await fetch(url, {
            method: "DELETE",
            headers: this.headers
        });
        const data = await response.json();
        const {result, code, error} = await data;
        if (code >= 400){
            return {result: [], error};
        }
        return {result, error: {}};
    }

    /**
     * Modifies an existing Sync Variant.
     *
     * Please note that in the request body you only need to specify the fields that need to be changed. See examples for more insights.
     * {@link https://developers.printful.com/docs/?_gl=1*1sbmfdi*_ga*NDMzMTM2Mjk0LjE2ODcyMzU3MDc.*_ga_EZ4XVRL864*MTY4ODc3OTM1NC4xMi4xLjE2ODg3ODEwMzYuMTAuMC4w#section/Products-API-examples/Modify-a-Sync-Variant See examples}
     * @param {int|string} id - Sync Variant ID (integer) or External ID (if prefixed with `@`)
     * @param {OptionalSyncVariant} sync_variant - Information about the Sync Variant
     *
     * @returns {promise} {variant, error}
     */
    async modifySyncVariant(id: number | string, sync_variant: OptionalSyncVariant){
        const url = this.origin+"/store/variants/"+id;
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(sync_variant),
            headers: this.headers
        });
        const data = await response.json();
        const {result: variant, code, error} = await data;
        if (code >= 400){
            return {variant: {}, error};
        }
        return {variant, error: {}};
    }

    /**
     * Creates a new Sync Variant for an existing Sync Product
     * {@link https://developers.printful.com/docs/?_gl=1*1sbmfdi*_ga*NDMzMTM2Mjk0LjE2ODcyMzU3MDc.*_ga_EZ4XVRL864*MTY4ODc3OTM1NC4xMi4xLjE2ODg3ODEwMzYuMTAuMC4w#section/Products-API-examples/Create-a-new-Sync-Variant See Examples}
     * 
     * @param {int|string} id - Sync Product ID (integer) or External ID (if prefixed with `@`)
     * @param {SyncVariant} sync_variant - Information about the Sync Variant
     * 
     * @returns {promise} {variant, error}
     */
    async createSyncVariant(id: number | string, sync_variant: SyncVariant){
        const url = this.origin+"/store/products/"+{id}+"/variants";
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(sync_variant),
            headers: this.headers
        });
        const data = await response.json();
        const {result: variant, code, error} = await data;
        if (code >= 400){
            return {variant: {}, error};
        }
        return {variant, error: {}};
    }

//------------------------------------------------------------------------------------------------------//
// IV. PRODUCT TEMPLATES API
//------------------------------------------------------------------------------------------------------//

    /**
     * Returns a list of templates.
     * 
     * Query Params:
     * @param {int} offset - Result set offset
     * @param {int} limit - Number of items per page (max 100)
     * 
     * @returns {promise} {templates,paging,error}
     */
    async getProductTemplates(offset=0,limit=20){
        const url = this.origin+"/product-templates"+"?offset="+offset+"&limit="+limit;
        const response = await fetch(url, {headers: this.headers});
        const data = await response.json();
        const {code, result, paging, error} = await data;
        if (code >= 400){
            return {templates: [], paging: {offset, limit}, error};
        }
        const {items: templates} = await result;
        return {templates,paging,error:{}};
        
    }

    /**
     * Get information about a single product template
     * 
     * @param {int|string} id - Template ID (integer) or External Product ID (if prefixed with `@`)
     * 
     * @returns {promise} {template,error}
     */
    async getProductTemplate(id:number|string){
        const url = this.origin+"/product-templates/"+id;
        const response = await fetch(url, {headers: this.headers});
        const data = await response.json();
        const {code, result, error} = await data;
        if (code >= 400){
            return {template: {}, error};
        }
        return {template: result, error: {}};
    }

    /**
     * Delete product template by ID or External Product ID
     * 
     * @param {int|string} id  - Template ID (integer) or External Product ID (if prefixed with `@`)
     * 
     * @returns {promise} {success, error}
     */
    async deleteProductTemplate(id:number|string){
        const url = this.origin+"/product-templates/"+id;
        const response = await fetch(url, {
            method: "DELETE",
            headers: this.headers,
        });
        const data = await response.json();
        const {code, result, error} = await data;
        if (code >= 400){
            return {success: false, error};
        }
        const {success} = await result;
        return {success, error: {}};
    }
//------------------------------------------------------------------------------------------------------//
// V. ORDERS API
//------------------------------------------------------------------------------------------------------//

    /**
     * Returns list of order objects from your store
     * 
     * QUERY PARAMS:
     * @param {string} status - Filter by order status
     * @param {int} offset -  Result set offset
     * @param {int} limit -  Number of items per page (max 100)
     * 
     * @returns {promise} {orders, paging, error}
     */
    async getOrders(offset=0, limit=20, status: OrderStatus){
        const url = this.origin+"/orders"+"?offset="+offset+"&limit="+limit+"&status="+status;
        const response = await fetch(url, {
            headers: this.headers,
        });
        const data = await response.json();
        const {code, result: orders, paging, error} = await data;
        if (code >= 400){
            return {orders: [], paging: {offset, limit}, error};
        }
        return {orders, paging, error: {}};
    }

    /**
     * Creates a new order and optionally submits it for fulfillment
     * 
     * QUERY PARAMS:
     * @param {NewOrder} newOrder - information about new order
     * @param {boolean} confirm - Automatically submit the newly created order for fulfillment (skip the Draft phase)
     * @param {boolean} update_existing - Try to update existing order if an order with the specified external_id already exists
     * 
     * @returns {promise} {order, error}
     */
    async createOrder(newOrder: NewOrder, confirm=false, update_existing=false){
        const url = this.origin+"/orders"+"?confirm="+confirm+"&update_existing="+update_existing;
        const response = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(newOrder)
        });
        const data = await response.json();
        const {code, result: order, error} = await data;
        if (code >= 400){
            return {order: {}, error};
        }
        return {order, error};
    }

    async getOrder(){}

    async cancelOrder(){}

    async updateOrder(){}

    async confirmOrder(){}

    async estimateOrderCost(){}
//------------------------------------------------------------------------------------------------------//
// VI. FILE LIBRARY API
//------------------------------------------------------------------------------------------------------//

    async addFile(){}

    async getFile(){}

    async getThreadColors(){}

//------------------------------------------------------------------------------------------------------//
// VII. SHIPPING RATE API
//------------------------------------------------------------------------------------------------------//

    async calculateShippint(){}

//------------------------------------------------------------------------------------------------------//
// VIII. ECOMMERCE PLATFORM SYNC API
//------------------------------------------------------------------------------------------------------//

    async getEcommProducts(){}

    async getEcommProduct(){}

    async deleteEcommProduct(){}

    async getEcommVariant(){}

    async modifyEcommVariant(){}

    async deleteEcommVariant(){}

//------------------------------------------------------------------------------------------------------//
// IX. COUNTRY/STATE CODE API
//------------------------------------------------------------------------------------------------------//

    async getCountryList(){}

//------------------------------------------------------------------------------------------------------//
// X. TAX RATE API
//------------------------------------------------------------------------------------------------------//

    async getCountryTexList(){}

    async calcTax(){}

//------------------------------------------------------------------------------------------------------//
// XI. WEBHOOK API
//------------------------------------------------------------------------------------------------------//

    async getWebhookConfig(){}

    async setWebhookConfig(){}

    async disableWebhookSupport(){}

//------------------------------------------------------------------------------------------------------//
// XII. STORE INFORMATION API
//------------------------------------------------------------------------------------------------------//

    async changePackingSlip(){}

    async getStoresInfo(){}

    async getStoreInfo(){}

//------------------------------------------------------------------------------------------------------//
// XIII. MOCKUP GENERATOR API
//------------------------------------------------------------------------------------------------------//

    async createMockupTask(){}

    async getProductVariantPrintFiles(){}

    async getMockupTaskResult(){}

    async getLayoutTemplates(){}

//------------------------------------------------------------------------------------------------------//
// XIV. WAREHOUSE PRODUCTS API
//------------------------------------------------------------------------------------------------------//

    async getWarehouseProducts(){}

    async getWarehouseProduct(){}

//------------------------------------------------------------------------------------------------------//
// XV. REPORTS API
//------------------------------------------------------------------------------------------------------//

    async getStats(){}

//------------------------------------------------------------------------------------------------------//
// XVI. APPROVAL SHEETS API
//------------------------------------------------------------------------------------------------------//

    async getApprovalSheets(){}

    async approveDesign(){}

    async changeApprovalSheet(){}

}

export function createPrintfulAcountClient(auth: string | undefined){
    return new PrintfulAcountClient(auth);
}