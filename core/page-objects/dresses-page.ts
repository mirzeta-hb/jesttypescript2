import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";
import { readFileSync } from "fs";
import * as path from "path";
const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class DressesPage extends BasePage {
    private sorting_header = By.id("productsSortForm");
    private sorting_option = By.id("selectProductSort");
    private choose_option = By.xpath('//select[@id="selectProductSort"]/option[@value="price:asc"]');
    private dress = By.xpath('//div[@class="product-image-container"]//a[@title="Printed Chiffon Dress"]');
    private quick_view = By.xpath('//div[@class="product-image-container"]//a[@class="quick-view"]');
    private closeButton = By.className("fancybox-item fancybox-close");
    private prices = By.xpath("//div[@class='content_price']/span[@class='price product-price']");
    private navigateToDressesButton = By.xpath("//a[@title = 'Dresses']"); 
    private view = By.className("display-title");
    private listButton = By.id("list");
    private compareDress = By.xpath('//div[@class="compare"]//a[@data-id-product="4"]');

    constructor(driver: WebDriver) {
        super(driver);
    }
    
    async navigateToDressesPage() {
        const navigation = await this.driver.findElements(this.navigateToDressesButton);
        await navigation[1].click();   
    }

    async chooseSortingOption(){
        this.isMatching(this.sorting_header, testData.headers.sort);
        await this.driver.findElement(this.sorting_option).click();
        const choose = await this.driver.wait(until.elementLocated(this.choose_option),20000);
        await this.scrollToElement(choose);
        await choose.click();
    }
    async selectQuickView(){
        const chosen_dress = await this.driver.wait(until.elementLocated(this.dress),10000);
        await this.scrollToElement(chosen_dress);
        await this.hoverElement(chosen_dress);
        await this.driver.findElement(this.quick_view).click();
        const button = await this.driver.wait(until.elementLocated(this.closeButton),10000);
        await button.click();  
    }
    async checkSortFromTheLowestPrice(){
        const checkHeader = await this.driver.findElement(this.sorting_header);
        await this.scrollToElement(checkHeader);
        const currentURL = await this.driver.getCurrentUrl();
        await expect(currentURL).toContain(testData.url.sort_url); 
        await this.checkPriceOfTheFirstElement();
    }
    async sortingProductsFromTheLowestPriceFirst(){
        await this.chooseSortingOption();
        await this.selectQuickView();
    }
    async checkPriceOfTheFirstElement() {
        const productPrice = await this.driver.wait(until.elementsLocated(this.prices),100000);
        let priceText;
        const first = '$16';
        for( let i = 0; i<productPrice.length; i++){
            if (i === 1){
                priceText = await productPrice[i].getText();
                expect(first).toEqual(priceText);
            }
        }      
    } 
    
    async checkListView(){
        await this.isMatching(this.view, testData.headers.view);
        await this.driver.findElement(this.listButton).isSelected();
    }
    async clickOnListViewButton(){
        await this.findElementAndClick(this.listButton);
        await this.checkListView();
    }

    async addDressToCompare(){
        await this.findElementAndClick(this.compareDress);
        await new Promise((resolve) => setTimeout(resolve, 1000)); 
    }
}