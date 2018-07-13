import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
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
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

Random rnd = new Random()

def randomdigit = rnd.nextInt(9999)

def usertestname = WebUI.concatenate(((['autouserqa', randomdigit]) as String[]))

WebUI.openBrowser('http://vladtest53b.admin.kademi-ci.co')

WebUI.setViewPortSize(1920, 1080)

not_run: WebUI.maximizeWindow()

WebUI.setText(findTestObject('kademi-vladtest/input_email'), GlobalVariable.admin)

WebUI.setText(findTestObject('kademi-vladtest/input_password'), GlobalVariable.admin_password)

WebUI.sendKeys(findTestObject('kademi-vladtest/input_password'), Keys.chord(Keys.ENTER))

WebUI.delay(15)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users (1)'))

WebUI.click(findTestObject('Kademi-vladtest22/span_Users'))

WebUI.click(findTestObject('Kademi-vladtest22/a_Add new user'))

WebUI.delay(1, FailureHandling.STOP_ON_FAILURE)

WebUI.focus(findTestObject('kademi-vladtest/div_modal-new-user'))

WebUI.click(findTestObject('Kademi-vladtest22/input_nickName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_nickName'), usertestname)

WebUI.click(findTestObject('Kademi-vladtest22/input_firstName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_firstName'), usertestname)

WebUI.click(findTestObject('Kademi-vladtest22/input_surName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_surName'), usertestname)

WebUI.click(findTestObject('Kademi-vladtest22/input_email (1)'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_email (1)'), WebUI.concatenate((([usertestname, '@mailinator.com']) as String[])))

WebUI.click(findTestObject('Kademi-vladtest22/select_group'))

WebUI.selectOptionByValue(findTestObject('Kademi-vladtest22/select_group'), 'public', true)

WebUI.click(findTestObject('Kademi-vladtest22/button_Create and view'))

WebUI.delay(5)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users (1)'))

WebUI.click(findTestObject('Kademi-vladtest22/span_Users'))

WebUI.setText(findTestObject('kademi-vladtest/input_user-query'), usertestname)

WebUI.delay(5)

WebUI.click(findTestObject('kademi-vladtest/input_toRemoveId'))

WebUI.click(findTestObject('kademi-vladtest/span_caret'))

WebUI.delay(2)

WebUI.click(findTestObject('kademi-vladtest/a_Remove'))

WebUI.delay(2)

WebUI.click(findTestObject('kademi-vladtest/button_Ok'))

WebUI.closeBrowser()

