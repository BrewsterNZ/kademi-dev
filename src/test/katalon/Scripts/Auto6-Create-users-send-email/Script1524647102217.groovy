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
import com.kms.katalon.core.testdata.CSVData as CSVData
import com.kms.katalon.core.logging.KeywordLogger as KeywordLogger

Random rnd = new Random()

def randomdigit = rnd.nextInt(9999)

def emailtestname = WebUI.concatenate(((['emailjob', randomdigit]) as String[]))

WebUI.openBrowser('http://vladtest53b.admin.kademi-ci.co')

not_run: WebUI.maximizeWindow()

WebUI.setViewPortSize(1920, 1080)

WebUI.setText(findTestObject('kademi-vladtest/input_email'), GlobalVariable.admin)

WebUI.setText(findTestObject('kademi-vladtest/input_password'), GlobalVariable.admin_password)

WebUI.sendKeys(findTestObject('kademi-vladtest/input_password'), Keys.chord(Keys.ENTER))

WebUI.delay(20)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users'))

WebUI.delay(1)

WebUI.click(findTestObject('Kademi-vladtest22/span_Users'))

def usertestname

for (def index : (1..10)) {
    usertestname = ('autouserqa' + index)

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

    WebUI.selectOptionByValue(findTestObject('Kademi-vladtest22/select_group'), 'contacts', true)

    WebUI.click(findTestObject('kademi-vladtest/button_Create and close_user-creation'))

    WebUI.delay(8)
}

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.delay(2)

WebUI.click(findTestObject('Email-job-case/Page_Manage users/span_Talk  Connect'))

WebUI.delay(1)

WebUI.click(findTestObject('Email-job-case/Page_Manage users/span_Send email'))

WebUI.delay(2)

WebUI.click(findTestObject('Email-job-case/Page_Send and manage emails/a_Create new email'))

WebUI.delay(2)

WebUI.focus(findTestObject('Email-job-case/Page_Send and manage emails/Create-email-modal'))

WebUI.click(findTestObject('Email-job-case/Page_Send and manage emails/email-job-name'))

WebUI.sendKeys(findTestObject('Email-job-case/Page_Send and manage emails/email-job-name'), emailtestname)

WebUI.click(findTestObject('Email-job-case/Page_Send and manage emails/button_Save_email-job'))

WebUI.delay(3)

WebUI.click(findTestObject('Email-job-case/Page_Send and manage emails/edit-email-job'))

WebUI.delay(5)

WebUI.click(findTestObject('Email-job-case/Page_emailjob1/input_subject_for_email_job'))

WebUI.sendKeys(findTestObject('Email-job-case/Page_emailjob1/input_subject_for_email_job'), WebUI.concatenate(((['Subject for '
                , emailtestname]) as String[])))

WebUI.selectOptionByIndex(findTestObject('Email-job-case/Page_emailjob1/select_Select a website-email-job'), 0, FailureHandling.STOP_ON_FAILURE)

WebUI.delay(1)

WebUI.click(findTestObject('Email-job-case/Page_emailjob1/a_Recipients-tab-email-job'))

WebUI.delay(2)

WebUI.click(findTestObject('Email-job-case/Page_emailjob1/button_Add recipient groups-email-job'))

WebUI.delay(1)

WebUI.focus(findTestObject('Email-job-case/Page_emailjob1/Choose-recepients-group-modal'))

WebUI.click(findTestObject('Email-job-case/Page_emailjob1/input_contacts-readiobutton-email-job'))

WebUI.click(findTestObject('Email-job-case/Page_emailjob1/button_Close_modal_for_recepients'))

WebUI.delay(2)

WebUI.click(findTestObject('Email-job-case/Page_emailjob1/button_Save-email-job'))

WebUI.click(findTestObject('Email-job-case/Page_emailjob1/a_Message-tab-email-job'))

WebUI.click(findTestObject('Email-job-case/Page_emailjob1/a_EDM editor-email-job'))

WebUI.delay(30)

WebUI.switchToWindowIndex('1')

WebUI.delay(1)

WebUI.dragAndDropToObject(findTestObject('Email-job-case/Page_Editor index.html/img_keditor-ui keditor-snippet-draggable'), 
    findTestObject('Email-job-case/Page_Editor index.html/div_edm-body-middle-placeholder-edm-editor-drop-area'))

WebUI.delay(5)

WebUI.click(findTestObject('Email-job-case/Page_Editor index.html/a_btn-save-file-edm-editor'))

WebUI.delay(1)

WebUI.closeWindowIndex('1')

WebUI.delay(2)

WebUI.switchToWindowIndex('0')

WebUI.click(findTestObject('Email-job-case/Page_emailjob1/button_Save-email-job'))

WebUI.refresh(FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Email-job-case/a_Send_email_job_tab'))

WebUI.delay(1)

WebUI.click(findTestObject('Email-job-case/button_SEND NOW_email_job'))

WebUI.delay(30)

WebUI.verifyElementText(findTestObject('Email-job-case/total-successdelivery_h5_11-email_delivery'), '10')

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users'))

WebUI.delay(1)

WebUI.click(findTestObject('Kademi-vladtest22/span_Users'))

WebUI.delay(1)

WebUI.setText(findTestObject('kademi-vladtest/input_user-query'), 'autouserqa')

WebUI.delay(5)

WebUI.click(findTestObject('Email-job-case/input_toRemoveId_remove_all_users_page_checkbox'))

WebUI.click(findTestObject('kademi-vladtest/span_caret'))

WebUI.delay(2)

WebUI.click(findTestObject('kademi-vladtest/a_Remove'))

WebUI.delay(2)

WebUI.click(findTestObject('kademi-vladtest/button_Ok'))

WebUI.delay(5)

WebUI.closeBrowser()

