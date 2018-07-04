import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.checkpoint.CheckpointFactory as CheckpointFactory
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as MobileBuiltInKeywords
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testcase.TestCaseFactory as TestCaseFactory
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testdata.TestDataFactory as TestDataFactory
import com.kms.katalon.core.testobject.ObjectRepository as ObjectRepository
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WSBuiltInKeywords
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUiBuiltInKeywords
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

Random rnd = new Random()

def randomdigit = rnd.nextInt(9999)

def pagetestname = WebUI.concatenate(((['pagetest', randomdigit]) as String[]))

WebUI.openBrowser('http://vladtest52zz.admin.kademi-ci.co')

not_run: WebUI.maximizeWindow()

WebUI.setViewPortSize(1920, 1080)

WebUI.setText(findTestObject('kademi-vladtest/input_email'), GlobalVariable.admin)

WebUI.setText(findTestObject('kademi-vladtest/input_password'), GlobalVariable.admin_password)

WebUI.sendKeys(findTestObject('kademi-vladtest/input_password'), Keys.chord(Keys.ENTER))

WebUI.delay(15)

WebUI.click(findTestObject('Kademi-vladtest22/span_Content'))

WebUI.click(findTestObject('Kademi-vladtest22/span_Edit web pages'))

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-folder'))

WebUI.delay(1)

WebUI.focus(findTestObject('Kademi-vladtest22/div_           New folder'))

WebUI.click(findTestObject('kademi-vladtest/input_newName (2)'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('kademi-vladtest/input_newName (2)'), 'testfolder')

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Create'))

WebUI.delay(2)

WebUI.click(findTestObject('kademi-vladtest/a_testfolder'))

WebUI.delay(2)

WebUI.click(findTestObject('Kademi-vladtest22/a_New Page_manage_web_pages'))

WebUI.delay(1)

WebUI.focus(findTestObject('Kademi-vladtest22/div_'))

WebUI.click(findTestObject('kademi-vladtest/input_title (1)'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('kademi-vladtest/input_title (1)'), pagetestname)

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Save  Close (1) (1)'))

WebUI.delay(5)

WebUI.click(findTestObject('Kademi-vladtest22/span_caret'))

WebUI.click(findTestObject('kademi-vladtest/a_Edit'))

WebUI.switchToWindowTitle(WebUI.concatenate(((['Edit: ', pagetestname, '.html']) as String[])))

WebUI.delay(30)

WebUI.setText(findTestObject('kademi-vladtest/input_keditor-container-snippe'), '33% 67%')

WebUI.delay(2)

WebUI.dragAndDropToObject(findTestObject('kademi-vladtest/33-66 section_keditor-ui keditor-sni'), findTestObject('kademi-vladtest/drop-div_keditor-content-area-15228'))

WebUI.delay(5)

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-files-o'))

WebUI.delay(1)

WebUI.setText(findTestObject('kademi-vladtest/input_keditor-component-snippe'), 'photo')

WebUI.delay(2)

WebUI.dragAndDropToObject(findTestObject('kademi-vladtest/photo block - section_keditor-ui keditor-sni'), findTestObject(
        'kademi-vladtest/33-to put - div_keditor-container-content-'))

WebUI.delay(10)

WebUI.setText(findTestObject('kademi-vladtest/input_keditor-component-snippe'), 'text')

WebUI.delay(2)

WebUI.dragAndDropToObject(findTestObject('kademi-vladtest/Text block - section_keditor-ui keditor-sni'), findTestObject(
        'kademi-vladtest/66 to put - div_keditor-container-content-'))

WebUI.delay(5)

WebUI.verifyElementVisible(findTestObject('kademi-vladtest/keditor image verify - img_img-responsive'))

WebUI.verifyElementPresent(findTestObject('kademi-vladtest/keditor text verify - p_Lorem ipsum dolor sit amet c'), 5)

not_run: WebUI.takeScreenshot('D:\\WORK\\katalon-screens\\keditor.png')

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-save'))

WebUI.delay(5)

WebUI.closeWindowTitle(WebUI.concatenate(((['Edit: ', pagetestname, '.html']) as String[])))

WebUI.delay(2)

WebUI.switchToWindowTitle('testfolder')

WebUI.click(findTestObject('kademi-vladtest/a_Parent directory'))

WebUI.delay(2)

WebUI.click(findTestObject('kademi-vladtest/testfolder delete - button_btn btn-info btn-sm dro'))

WebUI.delay(2)

WebUI.click(findTestObject('kademi-vladtest/delete testfolder dropdown button - a_Delete'))

WebUI.delay(2)

WebUI.acceptAlert()

WebUI.delay(2)

WebUI.closeBrowser()

