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

def randomdigit = rnd.nextInt(99999)

def acctestname = WebUI.concatenate(((['tstacc', randomdigit]) as String[]))

WebUI.openBrowser('http://katalontestacc3.admin.kademi-ci.co')

WebUI.setViewPortSize(1920, 1080)

WebUI.setText(findTestObject('kademi-vladtest/input_email'), GlobalVariable.admin)

WebUI.setText(findTestObject('kademi-vladtest/input_password'), GlobalVariable.admin_password)

WebUI.sendKeys(findTestObject('kademi-vladtest/input_password'), Keys.chord(Keys.ENTER))

WebUI.delay(20)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users'))

WebUI.delay(1)

WebUI.click(findTestObject('Kademi-vladtest22/span_Organisations'))

WebUI.click(findTestObject('Kademi-vladtest22/button_Tools'))

WebUI.click(findTestObject('Kademi-vladtest22/a_Create account'))

WebUI.delay(1, FailureHandling.STOP_ON_FAILURE)

WebUI.focus(findTestObject('Kademi-vladtest22/div_modal-create-account'))

WebUI.click(findTestObject('Kademi-vladtest22/input_title'))

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_title'), acctestname)

WebUI.click(findTestObject('Kademi-vladtest22/input_orgId'))

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_orgId'), acctestname)

WebUI.click(findTestObject('Kademi-vladtest22/button_Create'))

WebUI.delay(15, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users (1)'))

WebUI.click(findTestObject('Kademi-vladtest22/span_Users'))

WebUI.click(findTestObject('Kademi-vladtest22/a_Add new user'))

WebUI.delay(1, FailureHandling.STOP_ON_FAILURE)

WebUI.focus(findTestObject('kademi-vladtest/div_modal-new-user'))

WebUI.click(findTestObject('Kademi-vladtest22/input_nickName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_nickName'), GlobalVariable.admin.split('@')[0])

WebUI.click(findTestObject('Kademi-vladtest22/input_firstName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_firstName'), GlobalVariable.admin.split('@')[0])

WebUI.click(findTestObject('Kademi-vladtest22/input_surName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_surName'), GlobalVariable.admin.split('@')[0])

WebUI.click(findTestObject('Kademi-vladtest22/input_email (1)'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_email (1)'), GlobalVariable.admin)

WebUI.click(findTestObject('Kademi-vladtest22/select_group'))

WebUI.selectOptionByValue(findTestObject('Kademi-vladtest22/select_group'), 'administrator', true)

WebUI.click(findTestObject('Kademi-vladtest22/button_Create and view'))

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Kademi-vladtest22/a_Profile'))

WebUI.delay(1, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Kademi-vladtest22/input_password (1)'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_password (1)'), GlobalVariable.admin_password)

WebUI.click(findTestObject('Kademi-vladtest22/input_confirmPassword'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_confirmPassword'), GlobalVariable.admin_password)

WebUI.click(findTestObject('Email-job-case/Page_Manage users/button_Save-user_edit_page'))

WebUI.delay(5)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_Website Manager'))

WebUI.click(findTestObject('kademi-vladtest/span_Websites'))

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (3)'))

WebUI.focus(findTestObject('kademi-vladtest/div_                        Ad'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_newName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_newName'), WebUI.concatenate((([acctestname, 'web']) as String[])))

WebUI.click(findTestObject('kademi-vladtest/button_Create website'))

WebUI.delay(15)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KLearning'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_E-Learning'))

WebUI.click(findTestObject('kademi-vladtest/span_Courses'))

WebUI.click(findTestObject('kademi-vladtest/b_Program'))

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (4)'))

WebUI.delay(1)

WebUI.focus(findTestObject('kademi-vladtest/div_                        Pr'))

WebUI.click(findTestObject('kademi-vladtest/input_programName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_programName'), 'Program1')

WebUI.click(findTestObject('kademi-vladtest/input_programTitle'))

WebUI.setText(findTestObject('kademi-vladtest/input_programTitle'), 'Program1Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save'))

WebUI.delay(3)

WebUI.refresh()

WebUI.click(findTestObject('kademi-vladtest/a_New course'))

WebUI.delay(3)

WebUI.focus(findTestObject('kademi-vladtest/div_'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_courseName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_courseName'), 'Course1')

WebUI.click(findTestObject('kademi-vladtest/input_courseTitle'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_courseTitle'), 'Course1Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save (1)'))

WebUI.delay(3)

WebUI.click(findTestObject('kademi-vladtest/a_New module'))

WebUI.delay(1)

WebUI.focus(findTestObject('kademi-vladtest/div_ (1)'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_moduleName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleName'), 'Module1')

WebUI.click(findTestObject('kademi-vladtest/input_moduleTitle'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleTitle'), 'Module1Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save (2)'))

WebUI.delay(3)

WebUI.refresh()

WebUI.click(findTestObject('kademi-vladtest/a_New module'))

WebUI.focus(findTestObject('kademi-vladtest/div_ (1)'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_moduleName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleName'), 'Module2')

WebUI.click(findTestObject('kademi-vladtest/input_moduleTitle'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleTitle'), 'Module2Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save (2)'))

WebUI.delay(3)

WebUI.refresh()

WebUI.click(findTestObject('kademi-vladtest/a_New module'))

WebUI.focus(findTestObject('kademi-vladtest/div_ (1)'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_moduleName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleName'), 'Module3')

WebUI.click(findTestObject('kademi-vladtest/input_moduleTitle'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleTitle'), 'Module3Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save (2)'))

WebUI.delay(3)

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-cog'))

WebUI.click(findTestObject('kademi-vladtest/a_Manage this module'))

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus'))

WebUI.delay(20)

WebUI.setText(findTestObject('kademi-vladtest/input_pageTitle'), 'page1')

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Save  Close'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus'))

WebUI.delay(20)

WebUI.setText(findTestObject('kademi-vladtest/input_pageTitle'), 'page2')

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Save  Close'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus'))

WebUI.delay(20)

WebUI.setText(findTestObject('kademi-vladtest/input_pageTitle'), 'page3')

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Save  Close'))

WebUI.delay(10)

WebUI.click(findTestObject('Module-completion/a_Edit_module_page_1'))

WebUI.delay(1)

WebUI.switchToWindowTitle(WebUI.concatenate(((['Edit: ppage1.html']) as String[])))

WebUI.delay(20)

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

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-save'))

WebUI.delay(2)

WebUI.closeWindowTitle(WebUI.concatenate(((['Edit: ppage1.html']) as String[])))

WebUI.delay(2)

WebUI.switchToWindowTitle('Module1Title')

WebUI.click(findTestObject('Module-completion/a_Edit_module_page2'))

WebUI.delay(1)

WebUI.switchToWindowTitle(WebUI.concatenate(((['Edit: ppage2.html']) as String[])))

WebUI.delay(20)

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

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-save'))

WebUI.delay(2)

WebUI.closeWindowTitle(WebUI.concatenate(((['Edit: ppage2.html']) as String[])))

WebUI.delay(2)

WebUI.switchToWindowTitle('Module1Title')

WebUI.click(findTestObject('Module-completion/a_Edit_module_page3'))

WebUI.delay(1)

WebUI.switchToWindowTitle(WebUI.concatenate(((['Edit: ppage3.html']) as String[])))

WebUI.delay(20)

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

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-save'))

WebUI.delay(2)

WebUI.closeWindowTitle(WebUI.concatenate(((['Edit: ppage3.html']) as String[])))

WebUI.delay(2)

WebUI.switchToWindowTitle('Module1Title')

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.delay(3)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users'))

WebUI.delay(1)

WebUI.click(findTestObject('Module-completion/span_Groups'))

WebUI.delay(3)

WebUI.click(findTestObject('Module-completion/a_edit_learners_group'))

WebUI.delay(1)

WebUI.click(findTestObject('Module-completion/a_Addremove programs  courses'))

WebUI.delay(1)

WebUI.focus(findTestObject('Module-completion/Edit_group_programs_modal'))

WebUI.delay(1)

WebUI.click(findTestObject('Module-completion/label_Completable_for_Program1'))

WebUI.delay(5)

not_run: WebUI.click(findTestObject('Module-completion/button_Close_for_add_programs_to_group'))

not_run: WebUI.delay(1)

WebUI.click(findTestObject('Module-completion/button_Save_group_properties'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.delay(5)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users'))

WebUI.delay(1)

WebUI.click(findTestObject('Kademi-vladtest22/span_Users'))

def usertestname

for (def index : (1..9)) {
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

    WebUI.selectOptionByValue(findTestObject('Kademi-vladtest22/select_group'), 'learners', true)

    WebUI.click(findTestObject('kademi-vladtest/button_Create and close_user-creation'))

    WebUI.delay(8)
}

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.delay(1)

for (def index : (1..9)) {
    WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users (1)'))

    WebUI.delay(1)

    WebUI.click(findTestObject('Kademi-vladtest22/span_Users'))

    WebUI.delay(4)

    WebUI.setText(findTestObject('kademi-vladtest/input_user-query'), WebUI.concatenate(((['autouserqa', index]) as String[])))

    WebUI.delay(4)

    WebUI.click(findTestObject('Module-completion/dropdown-for-user-login-as'))

    WebUI.click(findTestObject('Module-completion/a_Login as this user'))

    WebUI.delay(2)

    WebUI.focus(findTestObject('Module-completion/div_login_as_modal'))

    WebUI.delay(1)

    WebUI.click(findTestObject('Module-completion/login-as-login-to-first-site'))

    WebUI.delay(8)

    WebUI.switchToWindowIndex(1)

    WebUI.delay(1)

    WebUI.click(findTestObject('Module-completion/a_My Learning_link_frontend'))

    WebUI.delay(2)

    WebUI.click(findTestObject('Module-completion/a_Start_m1'))

    WebUI.delay(4)

    WebUI.click(findTestObject('Module-completion/span_Next_module_page'))

    WebUI.delay(4)

    WebUI.click(findTestObject('Module-completion/span_Next_module_page'))

    WebUI.delay(4)

    WebUI.click(findTestObject('Module-completion/span_Submit_module_completion'))

    WebUI.delay(4)

    WebUI.focus(findTestObject('Module-completion/div_Module_completed_modal'))

    WebUI.delay(1)

    WebUI.click(findTestObject('Module-completion/a_My Learning_go-back-my-leaning-page'))

    WebUI.delay(2)

    not_run: WebUI.click(findTestObject('Module-completion/a_Start_m2'))

    not_run: WebUI.delay(4)

    not_run: WebUI.click(findTestObject('Module-completion/span_Next_module_page'))

    not_run: WebUI.delay(4)

    not_run: WebUI.click(findTestObject('Module-completion/span_Next_module_page'))

    not_run: WebUI.delay(4)

    not_run: WebUI.click(findTestObject('Module-completion/span_Submit_module_completion'))

    not_run: WebUI.delay(4)

    not_run: WebUI.focus(findTestObject('Module-completion/div_Module_completed_modal'))

    not_run: WebUI.delay(1)

    not_run: WebUI.click(findTestObject('Module-completion/a_My Learning_go-back-my-leaning-page'))

    not_run: WebUI.delay(2)

    not_run: WebUI.click(findTestObject('Module-completion/a_Start_m3'))

    not_run: WebUI.delay(4)

    not_run: WebUI.click(findTestObject('Module-completion/span_Next_module_page'))

    not_run: WebUI.delay(4)

    not_run: WebUI.click(findTestObject('Module-completion/span_Next_module_page'))

    not_run: WebUI.delay(4)

    not_run: WebUI.click(findTestObject('Module-completion/span_Submit_module_completion'))

    not_run: WebUI.delay(4)

    not_run: WebUI.focus(findTestObject('Module-completion/div_Module_completed_modal'))

    not_run: WebUI.delay(1)

    not_run: WebUI.click(findTestObject('Module-completion/a_My Learning_go-back-my-leaning-page'))

    not_run: WebUI.delay(2)

    WebUI.closeWindowIndex(1)

    WebUI.delay(1)

    WebUI.switchToWindowIndex(0)

    WebUI.click(findTestObject('Module-completion/button_Close_modal_login_as'), FailureHandling.STOP_ON_FAILURE)

    WebUI.delay(1)

    WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

    WebUI.delay(4)
}

WebUI.closeBrowser()

